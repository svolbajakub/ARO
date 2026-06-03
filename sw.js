// ARO Komunikátor — Service Worker
// Verzi změňte při každém nasazení nové verze (cache se vymaže automaticky)
const CACHE = 'aro-v1';
const ASSETS = [
  './aro-komunikator.html',
  './manifest.json',
  './icon.png',
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // cache one by one — don't fail if font CDN is unreachable offline
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first pro naše assety, network-first pro ostatní
self.addEventListener('fetch', e => {
  // Only handle GET
  if(e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(response => {
        // Cache valid responses for our origin
        if(response && response.status === 200 && response.type !== 'opaque'){
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return main HTML for navigation requests
        if(e.request.mode === 'navigate'){
          return caches.match('./aro-komunikator.html');
        }
      });
    })
  );
});
