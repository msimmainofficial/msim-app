// ======================================
// MSIM APP v2
// Service Worker
// ======================================


const CACHE_NAME = "msim-v2";


const FILES = [

"./",

"./index.html",
"./style.css",
"./script.js",
"./config.js",
"./manifest.json",

"./assets/logo.png",
"./assets/icon-192.png",
"./assets/icon-512.png"

];





self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{

return cache.addAll(FILES);

})

);


});






self.addEventListener(
"fetch",
event=>{


event.respondWith(

caches.match(event.request)
.then(response=>{


return response || fetch(event.request);


})


);


});
