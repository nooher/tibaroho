// Tumaini · TBHOS — service worker
// Strategies:
//   • App shell + static assets  → cache-first, fallback network
//   • HTML navigations           → network-first, fallback cached shell
//   • GET API                    → stale-while-revalidate (5-min ceiling)
//   • POST / non-GET             → never cached, pass-through
//   • Supabase auth & functions  → never cached
// Plus: Web Push handler, notification click → focus or open app.

const CACHE_VERSION = 'tumaini-v3'
const SHELL_CACHE   = `${CACHE_VERSION}-shell`
const ASSETS_CACHE  = `${CACHE_VERSION}-assets`
const API_CACHE     = `${CACHE_VERSION}-api`

const SHELL_URLS = ['/', '/index.html']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS).catch(() => undefined)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  )
})

const isHtmlRequest = (req) =>
  req.mode === 'navigate' ||
  (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))

const isAsset = (url) =>
  /\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico|gif|mp3)(\?|$)/i.test(url.pathname)

const isApiGet = (req, url) =>
  req.method === 'GET' &&
  (url.pathname.startsWith('/rest/v1/') || url.pathname.startsWith('/functions/v1/'))

const isNeverCached = (url) =>
  url.pathname.startsWith('/auth/') ||
  url.pathname.includes('/storage/v1/object/upload') ||
  url.pathname.includes('/realtime')

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || isNeverCached(url)) return // pass through

  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy)).catch(() => undefined)
          return res
        })
        .catch(() => caches.match('/index.html') || caches.match('/')),
    )
    return
  }

  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then((hit) =>
        hit ?? fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(ASSETS_CACHE).then((c) => c.put(request, copy)).catch(() => undefined)
          }
          return res
        }),
      ),
    )
    return
  }

  if (isApiGet(request, url)) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        cache.match(request).then((hit) => {
          const fresh = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone())
            return res
          }).catch(() => hit)
          return hit || fresh
        }),
      ),
    )
    return
  }
})

// ─── Web Push ───────────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let payload = { title: 'TABHOS', body: 'Una taarifa mpya.', tag: 'tabhos' }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch { /* parse error */ }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/brand/tumaini-192.png',
      badge: '/brand/tumaini-192.png',
      data: payload.data || {},
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client) client.navigate(target).catch(() => undefined)
          return
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    }),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
