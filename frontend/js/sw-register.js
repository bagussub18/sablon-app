if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => {
        console.log('SW Registered');
        
        // Cek jika ada update kode PWA
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Notifikasi bahwa ada versi baru, sarankan refresh
                alert('Aplikasi diperbarui! Silakan refresh halaman.');
                window.location.reload();
              }
            }
          };
        };
      })
      .catch(err => console.error('SW Failed', err));
  });
}
