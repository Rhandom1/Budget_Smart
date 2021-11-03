const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    // Add cache files here
    "/",
    "/manifest.webmanifest",
    
    "/index.html",
    "/index.js",
    "/style.css",
    "/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Add event listener for install 19.2.12
    // skipwaiting
self.addEventListener("install", function(evt) {
    //wait until...
    evt.waitUntil(
        //all files from the const CACHE_NAME have loaded
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
          })
        );
      
    self.skipWaiting();
});

// Add event listner for activate
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            //if version does not match, deletes the cache keys
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );

    self.clients.claim();
});

// Add event for fetch
self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }
// Add event for respondWith
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(evt.request).then(response => {
            return response || fetch(evt.request);
          });
        })
      );
})

