const CACHE_NAME = 'sablon-pro-v2'; // NAIKKAN VERSI KE V2
const IMG_CACHE = 'sablon-images-v1';

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
  '/icons/logo-sablon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // --- TAMBAHAN BARU: JANGAN CACHE DATA DARI RAILWAY ---
  // Jika request menuju ke domain railway atau mengandung kata 'api'
  if (url.origin.includes('railway.app') || url.pathname.includes('/api/')) {
    return event.respondWith(fetch(event.request)); 
    // Menggunakan fetch langsung tanpa cek cache agar data selalu baru
  }
  // ----------------------------------------------------

  // STRATEGI UNTUK GAMBAR
  if (event.request.destination === 'image' || url.pathname.includes('/resources/')) {
    event.respondWith(
      caches.open(IMG_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(newRes => {
            cache.put(event.request, newRes.clone());
            return newRes;
          });
        });
      })
    );
    return;
  }

  // STRATEGI UNTUK HALAMAN STATIS
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        // Hanya simpan ke cache jika request berhasil dan bukan data dinamis
        if(networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
