const CACHE_NAME = 'sablon-cache-v1';

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
  '/js/sw-register.js'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// FETCH (Offline ringan)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // fallback jika offline & buka halaman
        if (event.request.mode === 'navigate') {
          return caches.match('/frontend/index.html');
        }
      });
    })
  );
});
