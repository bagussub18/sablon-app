const CACHE_NAME = 'sablon-pro-v4'; // Naikkan ke V3
const IMG_CACHE = 'sablon-images-v1';
const DATA_CACHE = 'sablon-data-v1'; // Cache khusus untuk data database/API

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

// 1. INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// 2. ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== IMG_CACHE && key !== DATA_CACHE)
            .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. FETCH
self.addEventListener('fetch', event => {
  // --- TAMBAHAN: ABAIKAN SEMUA REQUEST BUKAN GET (SEPERTI POST) ---
  if (event.request.method !== 'GET') {
    return; // Biarkan request POST/PUT/DELETE langsung ke network
  }

  // --- STRATEGI DATA RAILWAY (DATABASE) ---
  // Agar data bisa dilihat offline tapi selalu update saat online
  if (url.origin.includes('railway.app') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Jika online, ambil data server dan simpan salinannya ke cache
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DATA_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Jika offline, ambil data terakhir yang pernah tersimpan
          return caches.match(event.request);
        })
    );
    return;
  }

  // --- STRATEGI GAMBAR ---
  if (event.request.destination === 'image' || url.pathname.includes('/resources/')) {
    event.respondWith(
      caches.open(IMG_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(newRes => {
            if (newRes.status === 200) {
              cache.put(event.request, newRes.clone());
            }
            return newRes;
          });
        });
      })
    );
    return;
  }

  // --- STRATEGI HALAMAN STATIS ---
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback jika halaman belum ter-cache dan offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
