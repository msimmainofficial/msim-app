/* ==========================================
   MSIM APP v2
   SERVICE WORKER
========================================== */

const CACHE_NAME = "msim-v2.0.0";

const FILES_TO_CACHE = [

"./",
"./index.html",
"./style.css",
"./script.js",
"./config.js",
"./manifest.json",

"./assets/logo.png",
"./assets/icon-192.png",
"./assets/icon-512.png",
"./assets/default-avatar.png"

];

/* ==========================
INSTALL
========================== */

self.addEventListener("install",(event)=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{

return cache.addAll(FILES_TO_CACHE);

})

);

self.skipWaiting();

});

/* ==========================
ACTIVATE
========================== */

self.addEventListener("activate",(event)=>{

event.waitUntil(

caches.keys()
.then(keys=>{

return Promise.all(

keys.map(key=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

/* ==========================
FETCH
========================== */

self.addEventListener("fetch",(event)=>{

if(event.request.method!=="GET"){

return;

}

event.respondWith(

caches.match(event.request)
.then(response=>{

if(response){

return response;

}

return fetch(event.request)
.then(networkResponse=>{

if(

!networkResponse ||

networkResponse.status!==200 ||

networkResponse.type!=="basic"

){

return networkResponse;

}

const clone =
networkResponse.clone();

caches.open(CACHE_NAME)
.then(cache=>{

cache.put(event.request,clone);

});

return networkResponse;

})
.catch(()=>{

return caches.match("./index.html");

});

})

);

});

/* ==========================
MESSAGE
========================== */

self.addEventListener("message",(event)=>{

if(event.data==="SKIP_WAITING"){

self.skipWaiting();

}

});

console.log("MSIM Service Worker Loaded");
