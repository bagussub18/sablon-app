const CACHE_NAME = 'sablon-pro-v1';
const IMG_CACHE = 'sablon-images-v1';

// Daftar file inti yang WAJIB ada agar aplikasi bisa terbuka
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
  '/icons/logo-sablon.png' // Pastikan nama file sesuai
];

// 1. INSTALL: Menyimpan file inti ke cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. ACTIVATE: Menghapus cache versi lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== IMG_CACHE)
            .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. FETCH: Logika pintar untuk Offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // STRATEGI UNTUK GAMBAR (Folder resources & resources/produk)
  if (event.request.destination === 'image' || url.pathname.includes('/resources/')) {
    event.respondWith(
      caches.open(IMG_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          // Ambil dari cache jika ada, jika tidak ada fetch dari network lalu simpan
          return response || fetch(event.request).then(newRes => {
            cache.put(event.request, newRes.clone());
            return newRes;
          });
        });
      })
    );
    return;
  }

  // STRATEGI UNTUK HALAMAN HTML & FILE LAINNYA
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Jika file (misal profil.html) ditemukan di cache, tampilkan langsung
      if (cachedResponse) {
        return cachedResponse;
      }

      // Jika tidak ada di cache, ambil dari internet
      return fetch(event.request).then(networkResponse => {
        // Simpan file baru tersebut ke cache secara otomatis
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // JIKA OFFLINE TOTAL dan file tidak ada di cache
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
