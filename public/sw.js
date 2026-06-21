// Tumaini service worker — minimal cache + push handler.
const CACHE = 'tumaini-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('push', (event) => {
  let payload = { title: 'Tumaini', body: 'Una taarifa mpya.', tag: 'tumaini' }
  try {
    if (event.data) {
      const data = event.data.json()
      payload = { ...payload, ...data }
    }
  } catch {
    // ignore parse errors
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/brand/tumaini-192.png',
      badge: '/brand/tumaini-192.png',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('/')
    }),
  )
})
