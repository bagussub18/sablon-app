const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const SECRET_KEY = 'secretkey_sablon'; // untuk skripsi OK, produksi pakai env

// =======================
// REGISTER (PELANGGAN)
// =======================
router.post('/register', (req, res) => {
  console.log("Register Terpanggil");
  
  const { nama, email, password, confirm_password } = req.body;

  if (!nama || !email || !password || !confirm_password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Password tidak sama' });
  }

  // cek email
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
        [nama, email, hashedPassword, 'pelanggan'],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: 'Pendaftaran berhasil' });
        }
      );
    }
  );
});

// =======================
// LOGIN
// =======================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (result.length === 0) {
        return res.status(401).json({ message: 'Email tidak ditemukan' });
      }

      const user = result[0];
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET_KEY,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          email: user.email,
          nama: user.nama,
          role: user.role
        }
      });
    }
  );
});

module.exports = router;
