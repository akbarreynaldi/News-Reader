//menyimpan asset ke cache storage
const CACHE_NAME = "codepolitan-reader-lite-v2";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/article.html",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/contact.html",
    "/pages/saved.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "/js/idb.js",
    "/js/db.js",
    "/icon.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

//menggunakan asset dari cache bila ada jika tidak ada maka menggunakan fetch request
self.addEventListener("fetch", function(event) {
    var base_url = "https://readerapi.codepolitan.com/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

//menghapus cache lama
self.addEventListener('activate', function(event) {
    console.log('Aktivasi service worker baru');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith("codepolitan-reader-lite")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});