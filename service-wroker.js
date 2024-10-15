const CACHE_NAME = 'ra-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/forms.html',
    '/health.html',
    '/information.html',
    '/styles.css',
    '/icon-192x192.png',
    '/icon-512x512.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
