const cacheName = 'notes 1.0.5'
const filesToCache = [
  '',
  'index.html',
  'css/colors.css',
  'css/styles.css',
  'js/array.observe.polyfill.js',
  'js/object.observe.polyfill.js',
  'js/scripts.js'
]

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] install')
  e.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('[ServiceWorker] caching app shell')
        return cache.addAll(filesToCache)
      })
      .catch(err => console.error('Error: ', err))
  )
})

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] activate')
  e.waitUntil(
    caches.keys().then((keyList) => Promise.all(
      keyList.map(key => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] removing old cache', key)
          return caches.delete(key)
        }
      })
    )).then(() => console.log('[ServiceWorker] version changed'))
  )
})

self.addEventListener('fetch', (e) => {
  console.log('[ServiceWorker] fetch', e.request.url)
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  )
})