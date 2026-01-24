const CACHE_NAME = 'sablon-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/profil.html',
  '/pesan.html',
  '/daftar.html',
  '/produk.html',
  '/css/style.css',
  '/js/script.js',
  '/js/sw-register.js',
  '/icons/logo-sablon.png' // Pastikan nama file lengkap
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Menggunakan addAll untuk file statis utama
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  return self.clients.claim();
});

// FETCH (Strategi agar Gambar terload otomatis saat offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 1. Jika ada di cache (termasuk gambar yang pernah dibuka), ambil dari cache
      if (response) return response;

      // 2. Jika tidak ada, ambil dari internet (Network)
      return fetch(event.request).then(fetchRes => {
        // Simpan otomatis gambar dari folder resources ke cache saat user membukanya (Online)
        if (event.request.url.includes('/resources/')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        }
        return fetchRes;
      }).catch(() => {
        // 3. Fallback jika Offline total & navigasi halaman
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
