// ARO Komunikátor — Service Worker
// Změňte CACHE_VERSION při každém nasazení nové verze
const CACHE_VERSION = '2026-06-03-1';
const CACHE = 'aro-' + CACHE_VERSION;

const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting()) // aktivuj okamžitě
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Network first pro HTML (vždy nejnovější), cache first pro ostatní
      if(e.request.mode === 'navigate'){
        return fetch(e.request)
          .then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
            return res;
          })
          .catch(() => cached || caches.match('./index.html'));
      }
      return cached || fetch(e.request).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
