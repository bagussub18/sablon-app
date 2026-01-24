if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => {
        console.log('SW Berhasil Terdaftar. Scope:', reg.scope);
      })
      .catch(err => {
        console.error('SW Gagal Terdaftar:', err);
      });
  });
}
