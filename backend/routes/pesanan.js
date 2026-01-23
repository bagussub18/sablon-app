const express = require('express');
const multer = require('multer');
const db = require('../config/db');

const router = express.Router();

// =======================
// KONFIGURASI UPLOAD
// =======================
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === 'desain') {
//       cb(null, path.join(__dirname, '../uploads/desain'));
//     } else {
//       cb(null, path.join(__dirname, '../uploads/bukti'));
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });


// const upload = multer({ storage });

// =======================
// TAMBAH PESANAN (PELANGGAN)
// =======================

// router.post(
//   '/pesanan',
//   upload.fields([
//     { name: 'desain', maxCount: 1 },
//     { name: 'bukti_pembayaran', maxCount: 1 }
//   ]),
//   (req, res) => {
//     const {
//       id_user,
//       nama_penerima,
//       jenis_barang,
//       alamat,
//       no_hp,
//       total_harga
//     } = req.body;

//     // localhost
//     // const desain = req.files['desain'][0].filename;
//     // const bukti = req.files['bukti_pembayaran'][0].filename;
//     // cloudinary
//     const desain = req.files.desain[0].path;
//     const bukti = req.files.bukti_pembayaran[0].path;

//     const sql = `
//       INSERT INTO pesanan
//       (id_user, nama_penerima, jenis_barang, desain, alamat, no_hp, bukti_pembayaran, total_harga, status)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
//     `;

//     db.query(
//       sql,
//       [id_user, nama_penerima, jenis_barang, desain, alamat, no_hp, bukti, total_harga],
//       (err) => {
//         if (err) return res.status(500).json(err);
//         res.json({ message: 'Pesanan berhasil dikirim' });
//       }
//     );
//   }
// );


const cloudinary = require('../config/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/pesanan',
  upload.fields([
    { name: 'desain', maxCount: 1 },
    { name: 'bukti_pembayaran', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const uploadImage = (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'sablon' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        });

      const desainUrl = await uploadImage(req.files.desain[0]);
      const buktiUrl = await uploadImage(req.files.bukti_pembayaran[0]);

      const data = {
        id_user: req.body.id_user,
        nama_penerima: req.body.nama_penerima,
        jenis_barang: req.body.jenis_barang,
        alamat: req.body.alamat,
        no_hp: req.body.no_hp,
        total_harga: req.body.total_harga,
        desain: desainUrl,
        bukti_pembayaran: buktiUrl,
        status: 'pending'
      };

      db.query('INSERT INTO pesanan SET ?', data, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Pesanan berhasil dikirim' });
      });

    } catch (err) {
      res.status(500).json({ message: 'Upload gagal', error: err });
    }
  }
);

module.exports = router;


// =======================
// AMBIL PESANAN USER
// =======================
// GET PESANAN USER (PELAGGAN)
// GET /api/pesanan/user/:id
router.get('/pesanan/user/:id', (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT SQL_CALC_FOUND_ROWS *
    FROM pesanan
    WHERE id_user = ?
  `;
  const params = [req.params.id];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json(err);

    db.query('SELECT FOUND_ROWS() AS total', (err, totalResult) => {
      if (err) return res.status(500).json(err);

      res.json({
        data,
        total: totalResult[0].total
      });
    });
  });
});


// =======================
// AMBIL SEMUA PESANAN (OWNER)
// =======================
router.get('/pesanan', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // jumlah data per halaman
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let sql = `
    SELECT SQL_CALC_FOUND_ROWS 
      p.*, u.nama AS nama_pelanggan
    FROM pesanan p
    JOIN users u ON p.id_user = u.id
  `;

  const params = [];

  if (status) {
    sql += ' WHERE p.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json(err);

    db.query('SELECT FOUND_ROWS() AS total', (err, totalResult) => {
      res.json({
        data,
        total: totalResult[0].total,
        page,
        limit
      });
    });
  });
});


// =======================
// UPDATE STATUS (OWNER)
// =======================
router.put('/pesanan/:id/status', (req, res) => {
  const { status } = req.body;

  db.query(
    'SELECT status FROM pesanan WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

      const currentStatus = result[0].status;

      const allowedTransitions = {
        pending: ['diproses', 'batal'],
        diproses: ['selesai', 'batal'],
        selesai: [],
        batal: []
      };

      if (!allowedTransitions[currentStatus].includes(status)) {
        return res.status(400).json({
          message: `Perubahan status dari ${currentStatus} ke ${status} tidak diizinkan`
        });
      }

      db.query(
        'UPDATE pesanan SET status = ? WHERE id = ?',
        [status, req.params.id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: 'Status pesanan diperbarui' });
        }
      );
    }
  );
});

module.exports = router;
