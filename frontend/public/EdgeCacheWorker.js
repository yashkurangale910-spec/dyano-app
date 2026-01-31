// EdgeCacheWorker.js - "Neural Speed" Phase 23
// Simulates Cloudflare Workers / Edge Distribution

const CACHE_NAME = 'dyano-neural-edge-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Intercept API calls for Roadmap and User Data
    if (url.pathname.includes('/api/roadmap') || url.pathname.includes('/api/progress')) {
        event.respondWith(
            staleWhileRevalidate(event.request)
        );
    }
    // Default network-first for others
});

// Strategy: Return cached immediately, then update from network
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    const networkFetch = fetch(request).then((response) => {
        // Update cache with fresh data
        cache.put(request, response.clone());
        return response;
    });

    // Return cached if available, otherwise wait for network
    return cachedResponse || networkFetch;
}
