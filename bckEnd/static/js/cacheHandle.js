var CACHE_VERSION = 1;
var CURRENT_CACHES = {
    font: 'font-cache-v' + CACHE_VERSION
};

self.addEventListener('activate', function(event){

    var expectedCacheNameSet = new Set(Object.values(CURRENT_CACHES));
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(!expectedCacheNameSet.has(cacheName)){
                        return caches.delete(cachName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(evt){
    evt.respondWith(
        caches.open(CURRENT_CACHES.font).then(function(cache){
            return cache.match(evt.request).then(function(response){
                if(response){
                    return response;
                }
            });
        })
    );
});