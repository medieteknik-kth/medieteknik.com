/**
 * @file service-worker.js
 * @description Service worker for caching and offline support
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */

/**
 * @description Debug mode, set to true to enable debug logging, change to false in production.
 * @type {boolean}
 * @constant
 * @default
 */
const DEBUG_MODE = false

/**
 * @description The cache name for runtime assets. This is used to store runtime assets that are updated frequently, should be pruned or removed at a constant rate.
 *     This is used to store assets that are not static, images, most other pages, etc.
 * @type {string}
 * @constant
 * @default
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */
const RUNTIME_CACHE = 'runtime-v1'

/**
 * @description The cache name for static assets. This is used to store static assets that are not updated frequently, should not be pruned or removed.
 * @type {string}
 * @constant
 * @default
 */
const STATIC_CACHE = 'static-v1'

const CACHE_TIMESTAMP_KEY = 'cache-timestamp'

/**
 * @description The resources to be cached during the installation of the service worker.
 * @type {string[]}
 * @constant
 * @default
 */
const precacheResources = [
  '/en/~offline',
  '/sv/~offline',
  '/web-app-manifest-192x192.png',
]

/**
 * @description The regular expression used to match URLs that should not be cached. This is used to prevent caching of certain URLs that are not needed or should not be cached.
 * @type {RegExp}
 * @constant
 * @default
 */
const BLACKLISTED_URLS_REGEX = new RegExp(
  [
    // Used for the manifest file and is very expensive to cache for large desktop screenshots.
    '/screenshots.*',

    // Next.js error frames, mostly used for debugging in a development environment.
    '/__nextjs_original-stack-frame.*',

    // User profile images, dynamic and could be large.
    '%2Fmedieteknik-static%2Fprofile.*',

    // News images, generally unneccessary for offline use, may change later.
    '%2Fmedieteknik-static%2Fnews.*',

    // YouTube thumbnails, can be copyrighted, and you can't access YouTube offline.
    '%2Fi.ytimg.com%2Fvi.*',
  ].join('|')
)

/**
 * @description The header used to store the cache timestamp. This is used to determine if a cache entry is expired.
 * @type {string}
 * @constant
 * @default
 */
const CACHE_TIMESTAMP_HEADER = 'X-Time-Cache'

/**
 * @description The maximum age of the cache in milliseconds. This is used to determine if a cache entry is expired. 30 days.
 * @type {number}
 * @constant
 * @default
 */
const MAX_CACHE_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * @description The last time the cache was checked for expired entries. This is used to prevent checking the cache too frequently.
 * @type {number}
 */
let lastCacheCheck = 0

/**
 * @name cleanupExpiredCache
 * @description Cleans up expired cache entries, will remove entries older than 30 days. All cache entries will be updated with a new timestamp when they are fetched.
 *     Meaning that this will prune entries that haven't been used in 30 days. This can only be called every 30 days.
 *     This function is called by the service worker when it is activated and also by the periodic sync event.
 *
 * @returns {Promise<void>}
 * @throws {Error} If the periodic sync registration fails
 */
async function cleanupExpiredCache() {
  const now = Date.now()

  if (now - lastCacheCheck < 24 * 60 * 60 * 1000) {
    // Only run this function every 24 hours
    return
  }

  lastCacheCheck = now
  try {
    const cache = await caches.open(RUNTIME_CACHE)
    if (!cache) {
      if (DEBUG_MODE) {
        console.warn(
          '[Service Worker] Cache not found. Skipping cleanup of expired cache.'
        )
      }
      return
    }

    const timestampResponse = await cache.match(CACHE_TIMESTAMP_KEY)
    if (!timestampResponse) {
      if (DEBUG_MODE) {
        console.warn(
          '[Service Worker] Cache timestamp not found. Skipping cleanup of expired cache.'
        )
      }
      return
    }

    const lastUpdated = Number.parseInt(await timestampResponse.text(), 10)
    const daysPassed = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24))

    if (daysPassed < 30) {
      if (DEBUG_MODE) {
        console.log(
          `[Service Worker] Cache cleanup skipped. Days passed since last update: ${daysPassed}`
        )
      }
      return
    }

    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)

      if (!response) {
        continue
      }

      const cacheTimestamp = response.headers.get(CACHE_TIMESTAMP_HEADER)
      if (!cacheTimestamp) {
        continue
      }

      const cacheAge = now - Number.parseInt(cacheTimestamp, 10)

      if (cacheAge > MAX_CACHE_AGE) {
        if (DEBUG_MODE)
          console.log(
            `[Service Worker] Deleting expired cache for ${request.url}`
          )
        await cache.delete(request)
      }
    }

    // Update the cache timestamp to the current time
    const newTimestamp = new Response(now.toString())
    await cache.put(CACHE_TIMESTAMP_KEY, newTimestamp)

    if (DEBUG_MODE)
      console.log(
        `[Service Worker] Cache timestamp updated. Days passed since last update: ${daysPassed}`
      )
  } catch (error) {
    console.error('[Service Worker] Error cleaning up expired cache:', error)
  }
}

self.addEventListener(
  'install',
  /**
   * @description Service worker installation event handler, triggered when the service worker is installed
   *
   * @param {ExtendableEvent} event - The installation event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event
   */
  (event) => {
    if (DEBUG_MODE) console.log('[Service Worker] installed')

    event.waitUntil(
      Promise.all([
        caches.open(STATIC_CACHE).then((cache) => {
          return cache.addAll(precacheResources)
        }),
        caches.open(RUNTIME_CACHE).then((cache) => {
          return cache.put(
            CACHE_TIMESTAMP_KEY,
            new Response(Date.now().toString())
          )
        }),
      ])
    )
  }
)

self.addEventListener(
  'activate',
  /**
   * @description Service worker activation event handler
   * @param {ExtendableEvent} event - The activation event
   */
  (event) => {
    if (DEBUG_MODE) console.log('[Service Worker] activated')

    event.waitUntil(
      Promise.all([
        caches
          .keys()
          .then((keys) =>
            Promise.all(
              keys.map((key) => {
                if (![STATIC_CACHE, RUNTIME_CACHE].includes(key)) {
                  return caches.delete(key)
                }
              })
            )
          )
          .then(() => self.clients.claim()),
        cleanupExpiredCache(),
      ])
    )

    event.waitUntil(self.clients.claim())
  }
)

self.addEventListener(
  'periodicsync',
  /**
   * @description Periodic sync event handler
   *
   * // WARNING: Not available in all browsers.
   * @param {PeriodicSyncEvent} event - The periodic sync event
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PeriodicSyncEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/periodicsync_event
   */
  (event) => {
    if (DEBUG_MODE) console.log('[Service Worker] Periodic sync event:', event)
    if (event.tag === 'cleanup-cache') {
      event.waitUntil(cleanupExpiredCache())
    }
  }
)

self.addEventListener(
  'message',
  /**
   * @description Message event handler, triggered when a message is received from the client
   *
   * @param {MessageEvent} event - The message event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
   */
  (event) => {
    if (DEBUG_MODE) console.log('[Service Worker] Message event:', event.data)

    if (event.data && event.data.type === 'REGISTER_PERIODIC_SYNC') {
      self.registration.periodicSync
        .register('cleanup-cache', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        })
        .catch((error) => {
          console.error(
            '[Service Worker] Periodic sync registration failed (Are you using the PWA mode?):',
            error
          )
        })
    }
  }
)

self.addEventListener(
  'push',
  /**
   * @description Push event handler, triggered when a push notification is received
   *
   * @param {PushEvent} event - The push event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PushEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/push_event
   */
  (event) => {
    if (Notification.permission !== 'granted') {
      return
    }
    if (DEBUG_MODE) console.log('[Service Worker] Push event:', event.data)

    const options = {
      body: 'Default message',
      icon: '/web-app-manifest-192x192-maskable.png',
      badge: '/web-app-manifest-192x192-maskable.png',
      tag: 'notification-tag',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1',
      },
    }

    try {
      const data = event.data.json()
      options.body = data.body || options.body
      options.title = data.title || 'New Notification'
    } catch (error) {
      console.warn('[Service Worker] Error parsing push data:', error)
    }

    event.waitUntil(
      self.registration.showNotification(
        options.title || 'New Notification',
        options
      )
    )
  }
)

self.addEventListener(
  'notificationclick',
  /**
   * @description Notification click event handler, triggered when a notification is clicked
   *
   * @param {NotificationEvent} event - The notification event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
   */
  (event) => {
    if (DEBUG_MODE)
      console.log('[Service Worker] Notification click event:', event)
    event.notification.close()

    event.waitUntil(clients.openWindow('https://www.google.com'))
  }
)

/**
 * @name shouldCache
 * @description Check if the response should be cached
 *
 * @param {Response} response - The response to check for caching
 * @param {Request} request - The request that triggered the response
 * @returns {boolean} - True if the response should be cached, false otherwise
 */
function shouldCache(response, request) {
  if (!response || response.status !== 200 || response.type !== 'basic') {
    return false
  }

  if (!request.url.startsWith('http')) {
    return false
  }

  // Dont cache API requests
  if (request.url.includes('/api/')) {
    return false
  }

  if (request.method !== 'GET') {
    return false
  }

  const isBlacklisted = BLACKLISTED_URLS_REGEX.test(request.url)

  if (isBlacklisted) {
    return false
  }

  return true
}

/**
 * @name showOfflinePage
 * @description Show the offline page when the user is offline, or a 503 fail if the offline page is not available.
 * @param {string} language - The language of the offline page to show
 *
 * @returns {Promise<Response>} - The offline page response
 * @throws {Error} - If the offline page is not available
 */
async function showOfflinePage(language) {
  return caches
    .match(`/${language}/~offline`)
    .then((offlineResponse) => {
      if (offlineResponse) {
        return offlineResponse
      }
    })
    .catch(() => {
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      })
    })
}

self.addEventListener(
  'fetch',
  /**
   * @description Fetch event handler
   *
   * @param {FetchEvent} event - The fetch event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event
   */
  (event) => {
    /**
     * @description Request object representing the request being made
     * @type {Request}
     */
    const request = event.request

    cleanupExpiredCache()

    // Skip memory and disk cache for requests with Cache-Control: no-store, immutable, or max-age=31536000
    const cacheControl = request.headers.get('Cache-Control')
    if (
      cacheControl &&
      (cacheControl.includes('no-store') ||
        cacheControl.includes('immutable') ||
        cacheControl.includes('max-age=31536000'))
    ) {
      return event.respondWith(fetch(request))
    }

    const url = new URL(request.url)
    const isFont = /\.(woff2|woff|ttf)$/.test(url.pathname)
    const isStaticAsset =
      url.pathname.includes('medieteknik-static%2Fstatic') ||
      url.pathname.endsWith('manifest.webmanifest') ||
      url.pathname.endsWith('web-app-manifest-192x192.png')

    if (isFont || isStaticAsset) {
      event.respondWith(
        caches.open(STATIC_CACHE).then(async (cache) => {
          // Stale-While-Revalidate
          return cache.match(request).then((cacheResponse) => {
            const fetchPromise = fetch(request).then((fetchResponse) => {
              cache.put(request, fetchResponse.clone())
              return fetchResponse
            })

            return cacheResponse || fetchPromise
          })
        })
      )
      return
    }

    event.respondWith(
      fetch(request)
        .then((fetchResponse) => {
          if (shouldCache(fetchResponse, request)) {
            let requestToCache = request

            if (url.search.includes('?_rsc')) {
              // Remove the _rsc query parameter from the request URL, for caching Next.js SSR links
              /* WARNING: For dynamic pages, this will cache the first page visited with the _rsc query parameter, 
            shouldn't be a problem for most use cases since this is a network-first strategy. */
              requestToCache = new Request(url.href.replace(url.search, ''))
            }

            const responseClone = fetchResponse.clone()

            if (request.method !== 'GET') {
              return fetchResponse
            }

            const newHeaders = new Headers(responseClone.headers)
            newHeaders.append(CACHE_TIMESTAMP_HEADER, Date.now().toString())

            responseClone.blob().then((body) => {
              const modifiedResponse = new Response(body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: newHeaders,
              })

              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(requestToCache, modifiedResponse.clone())
              })
            })
          }

          return fetchResponse
        })
        .catch(async () => {
          let modifiedRequest = request

          if (url.search.includes('?_rsc')) {
            // Remove the _rsc query parameter from the request URL, for caching Next.js SSR links
            /* WARNING: For dynamic pages, this will cache the first page visited with the _rsc query parameter, 
          shouldn't be a problem for most use cases since this is a network-first strategy. */
            modifiedRequest = new Request(url.href.replace(url.search, ''))
          }

          const fallbackResponse = await caches.match(modifiedRequest)
          if (fallbackResponse) {
            return fallbackResponse
          }
          const language = url.pathname.startsWith('/sv') ? 'sv' : 'en'
          return showOfflinePage(language)
        })
    )
  }
)

self.addEventListener(
  'error',
  /**
   * @description Error event handler, triggered when an error occurs in the service worker
   *
   * @param {ErrorEvent} event - The error event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/error_event
   */
  (event) => console.error('[Service Worker] Error:', event.error)
)

self.addEventListener(
  'unhandledrejection',
  /**
   * @description Unhandled rejection event handler, triggered when a promise is rejected and not handled
   *
   * @param {PromiseRejectionEvent} event - The unhandled rejection event
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/unhandledrejection_event
   */
  (event) =>
    console.error('[Service Worker] Unhandled promise rejection:', event.reason)
)
