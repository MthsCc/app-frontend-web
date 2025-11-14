// Service Worker para cache e performance
const CACHE_NAME = 'echoview-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/catalogo.html',
    '/perfil.html',
    '/categoria.html',
    '/login.html',
    '/registro.html'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                // Continuar mesmo se alguns assets não estiverem disponíveis
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estratégia de fetch: Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Não cachear requisições para API
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            })
        );
        return;
    }

    // Para imagens: Cache first, fallback to network
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request).then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                }).catch(() => {
                    return new Response('Image not found', { status: 404 });
                });
            })
        );
        return;
    }

    // Para outros recursos: Network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, clonedResponse);
                });
                return response;
            })
            .catch(() => {
                return caches.match(request) || new Response('Offline', { status: 503 });
            })
    );
});
