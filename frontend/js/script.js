// fetch('http://localhost:3000/api/register')
// fetch('http://localhost:3000/api/login')
// fetch('http://localhost:3000/api/pesanan')

const user = JSON.parse(localStorage.getItem('user'));
let currentOwnerStatus = 'pending';

if (user && window.location.pathname.includes('login.html')) {
  window.location.href = 'profil.html';
}

document.addEventListener('DOMContentLoaded', () => {

  const myProfil = document.getElementById('profilNama');
  if (!myProfil) return;
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // tampilkan profil
  document.getElementById('profilNama').textContent = user.nama;
  document.getElementById('profilEmail').textContent = user.email;
  document.getElementById('profilRole').textContent = user.role;

  // tampilkan pesanan sesuai role
  if (user.role === 'pelanggan') {
  document.getElementById('pelangganSection').style.display = 'block';
  loadPesanan('pending'); // default
}

  if (user.role === 'owner') {
  document.getElementById('ownerSection').style.display = 'block';
  document.getElementById('pesanSablon').style.display = 'none'
  loadPesananOwner('pending');
}


});

//login
document.getElementById('btnLogin')?.addEventListener('click', async (e) => {
  e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('https://sablon-app-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login berhasil');
        window.location.href = 'profil.html';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal koneksi ke server');
    }
  });
// });

//login


//logout
document.getElementById('btnLogout')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

//logout

//daftar

document.getElementById('btnDaftar')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm_password = document.getElementById('confirm_password').value;

  const res = await fetch('https://sablon-app-production.up.railway.app/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama, email, password, confirm_password })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    window.location.href = 'login.html';
  }
});

//daftar


//pesan
document.getElementById('btnPesan')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  let wa = document.getElementById('no_hp').value;
  let waFix = "";

  if (wa.charAt(0) === "0") {
      waFix = "62" + wa.substring(1);
  } else if (wa.startsWith("62")) {
      waFix = wa;
  } else {
      waFix = "62" + wa;
  }

  const formData = new FormData();
  formData.append('id_user', user.id);
  formData.append('nama_penerima', document.getElementById('nama').value);
  formData.append('jenis_barang', document.getElementById('jenis_barang').value);
  formData.append('alamat', document.getElementById('alamat').value);
  formData.append('no_hp', waFix);
  formData.append('total_harga', document.getElementById('total_harga').value);
  formData.append('desain', document.getElementById('desain').files[0]);
  formData.append('bukti_pembayaran', document.getElementById('bukti').files[0]);

  const res = await fetch('https://sablon-app-production.up.railway.app/api/pesanan', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    window.location.href = 'profil.html';
  }
});

//pesanan


//tampil pesan pelanggan
async function loadPesanan(status = currentPelangganStatus) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  const res = await fetch(
    `https://sablon-app-production.up.railway.app/api/pesanan/user/${user.id}?status=${status}&page=${pelangganPage}&limit=${pelangganLimit}`
  );

  const result = await res.json();
  const data = result.data;
  const total = result.total;

  pelangganTotalPage = Math.ceil(total / pelangganLimit);

  renderPesanan(data);
  updatePaginationPelanggan();
}

function renderPesanan(data) {
  const table = document.getElementById('pesananTable');
  table.innerHTML = '';

  if (data.length === 0) {
    table.innerHTML = '<tr><td colspan="10" style="text-align:center;">Tidak ada data</td></tr>';
    return;
  }

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.nama_penerima}</td>
        <td>${p.alamat}</td>
        <td>${p.no_hp}</td>
        <td>${p.jenis_barang}</td>
        <td>
          <a href="${p.desain}" target="_blank">Lihat</a>
        </td>
        <td>
          <a href="${p.bukti_pembayaran}" target="_blank">Lihat</a>
        </td>
        <td>Rp ${p.total_harga}</td>
        <td>${new Date(p.created_at).toLocaleString('id-ID')}</td>
        <td>${p.status}</td>
      </tr>
    `;
  });
}

/*<a href="http://localhost:3000/uploads/bukti/${p.bukti_pembayaran}" target="_blank">Lihat</a>*/

//pagination Pelanggan
let pelangganPage = 1;
let pelangganTotalPage = 1;
const pelangganLimit = 5;
let currentPelangganStatus = 'pending';

function updatePaginationPelanggan() {
  document.getElementById('pageInfoPelanggan').textContent =
    `Hal ${pelangganPage} dari ${pelangganTotalPage}`;
}

function nextPelanggan() {
  if (pelangganPage < pelangganTotalPage) {
    pelangganPage++;
    loadPesanan();
  }
}

function prevPelanggan() {
  if (pelangganPage > 1) {
    pelangganPage--;
    loadPesanan();
  }
}

function filterPelangganStatus(status) {
  pelangganPage = 1;
  currentPelangganStatus = status;
  loadPesanan(status);
}

//tampil pesan owner
async function loadPesananOwner(status = '') {
  currentOwnerStatus = status;

  let url = `https://sablon-app-production.up.railway.app/api/pesanan?page=${ownerPage}`;
  if (status) url += `&status=${status}`;

  const res = await fetch(url);
  const result = await res.json();

  ownerTotal = result.total;
  const data = result.data;

  const table = document.getElementById('ownerTable');
  table.innerHTML = '';

  if (data.length === 0) {
    table.innerHTML = '<tr><td colspan="10" style="text-align:center;">Tidak ada data</td></tr>';
    updateOwnerPaginationInfo();
    return;
  }

  function getStatusOptions(status) {
  if (status === 'pending') {
    return `
      <option selected>pending</option>
      <option value="diproses">diproses</option>
      <option value="batal">batal</option>
    `;
  }
  if (status === 'diproses') {
    return `
      <option selected>diproses</option>
      <option value="selesai">selesai</option>
      <option value="batal">batal</option>
    `;
  }
  return `<option selected>${status}</option>`;
}

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.nama_penerima}</td>
        <td>${p.alamat}</td>
        <td><a href="https://wa.me/${p.no_hp}?text=Halo%20${p.nama_penerima}%2C%20Kami%20dari%20Robby%20Sablon.%0ATerima%20Kasih%20sudah%20mempercayakan%20produk%20anda%20kepada%20kami.%0APesanan%20anda%3A%20Barang%3A%20${p.jenis_barang}%0AStatus%3A%20${p.status}" target="_blank">${p.no_hp}</td>
        <td>${p.jenis_barang}</td>
        <td>
          <a href="/uploads/desain/${p.desain}" target="_blank">Desain</a>
          <a href="/uploads/desain/${p.desain}" download=${p.nama_pelanggan}>Download</a>
        </td>
        <td>
          <a href="/uploads/bukti/${p.bukti_pembayaran}" target="_blank">Bukti</a>
          <a href="/uploads/bukti/${p.bukti_pembayaran}" download=${p.nama_pelanggan}>Download</a>
        </td>
        <td>Rp ${p.total_harga}</td>
        <td>${new Date(p.created_at).toLocaleString('id-ID')}</td>
        <td>${p.status}</td>
        <td>
          <select onchange="updateStatus(${p.id}, this.value)">
            ${getStatusOptions(p.status)}
          </select>
        </td>
      </tr>
    `;
  });

  updateOwnerPaginationInfo();
}

//Pagination Owner
let ownerPage = 1;
let ownerTotal = 0;
const ownerLimit = 5;
currentOwnerStatus = '';

function updateOwnerPaginationInfo() {
  const totalPage = Math.ceil(ownerTotal / ownerLimit);
  document.getElementById('pageInfoOwner').textContent =
    `Hal ${ownerPage} dari ${totalPage}`;
}

function nextPageOwner() {
  if (ownerPage * ownerLimit < ownerTotal) {
    ownerPage++;
    loadPesananOwner(currentOwnerStatus);
  }
}

function prevPageOwner() {
  if (ownerPage > 1) {
    ownerPage--;
    loadPesananOwner(currentOwnerStatus);
  }
}
//reset
function filterOwnerStatus(status) {
  ownerPage = 1;
  loadPesananOwner(status);
}
//Paginatiob Owner


async function updateStatus(id, status) {
  const res = await fetch(`https://sablon-app-production.up.railway.app/api/pesanan/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const data = await res.json();
  alert(data.message);

  loadPesananOwner(currentOwnerStatus);
}

//tampil pesan owner
