// Service Worker para PWA
const CACHE_NAME = 'radar-da-voz-v1'
const API_CACHE = 'radar-api-v1'
const IMAGE_CACHE = 'radar-images-v1'

const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/styles/globals.css',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - Network first for API, Cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API calls - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, clone)
          })
          return response
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || new Response('Offline', { status: 503 })
          })
        })
    )
  }

  // Images - Cache first, fallback to network
  else if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((response) => {
              cache.put(request, response.clone())
              return response
            })
          )
        })
      })
    )
  }

  // HTML/JS/CSS - Cache first
  else {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone())
              return response
            })
          })
        )
      })
    )
  }
})

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})

async function syncMessages() {
  try {
    const response = await fetch('/api/messages/sync', {
      method: 'POST',
    })
    return response.json()
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Você tem uma nova notificação!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'notification',
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification('Radar da Voz', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus()
      }
      return clients.openWindow('/')
    })
  )
})
