self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('my-app-cache').then(cache => {
        return cache.addAll([
          '/', // Página principal
          '/index.html',
          '/index.css',
          '/manifest.json',
          '/service-worker.js', // Cachear también el service worker
          '/assets/maap.jpg',
          '/assets/maap1.jpg',
          '/assets/maapM.jpg',
          '/assets/maap1M.jpg',
          '/assets/spc.png',
          '/assets/scl.png'
        ]).catch(error => {
          console.error('Failed to cache:', error);
          throw error;
        });
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchResponse => {
          return caches.open('my-app-cache').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(error => {
          console.error('Fetch failed:', error);
          return caches.match('/index.html');
        });
      })
    );
  });
  