/* Orloj service worker — offline-first app shell */
var CACHE = "orloj-v1";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./orloj-icon-180.png", "./orloj-icon-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        return caches.open(CACHE).then(function(c){ try{ c.put(e.request, res.clone()); }catch(_){} return res; });
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
