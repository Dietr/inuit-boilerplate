"use strict";

console.log('WORKER: executing.');

/* A version number is useful when updating the worker logic,
   allowing you to remove outdated cache entries during the update.
*/
var version = 'v1.0::';

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/
addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open('inuit')
    .then( mrsmrCache => {
      mrsmrCache.addAll([
        '/offline/index.html',
        '/assets/img/svg/svg-symbols.svg'
      ]); // end addAll
    }) // end open.then
  ); // end waitUntil
}); // end addEventListener

/* The fetch event fires whenever a page controlled by this service worker requests
   a resource.
*/
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    // First, try to fetch it from the network
    fetch(request)
    .then( responseFromFetch => {
      return responseFromFetch;
    }) // end fetch.then
    // But if that doesn't work
    .catch( fetchError => {
      // try to find it in the cache
      caches.match(request)
      .then( responseFromCache => {
        if (responseFromCache) {
         return responseFromCache;
       // But if that doesn't work
       } else {
         // and it's a request for a web page
         if (request.headers.get('Accept').includes('text/html')) {
           // show the custom offline page instead
           return caches.match('/offline/index.html');
         } // end if
       } // end if/else
     }) // end match.then
   }) // end fetch.catch
  ); // end respondWith
}); // end addEventListener

/* The activate event.
*/
self.addEventListener("activate", function(event) {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
     Activation will fail unless the promise is fulfilled.
  */
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then(function (keys) {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(version);
            })
            .map(function (key) {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        console.log('WORKER: activate completed.');
      })
  );
});
