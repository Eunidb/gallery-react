self.addEventListener('install', event => { 
  event.waitUntil( 
    caches.open('my-app-cache').then(cache => { 
      return cache.addAll([ 
        '/', // Página principal 
        '/index.html', 
        '/index.css', 
        '/manifest.json', 
        '/service-worker.js', // Cachear también el service worker 
        '/assets/img.jpeg', 
        '/assets/img2.jpeg', 
        '/assets/img3.jpeg', 
        '/assets/img4.jpeg' 
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