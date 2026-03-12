// Service Worker for Moment Toolbox - PWA Offline Support
const CACHE_NAME = 'moment-toolbox-v1'
const OFFLINE_URL = '/offline.html'

// 需要缓存的核心资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg'
]

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Installation complete, skipping waiting')
        return self.skipWaiting()
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err)
      })
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => {
        console.log('[SW] Activation complete, claiming clients')
        return self.clients.claim()
      })
  )
})

// 请求拦截 - 网络优先，失败时从缓存读取
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return
  
  // 跳过外部资源
  if (!event.request.url.startsWith(self.location.origin)) return
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 网络请求成功，克隆并缓存
        const responseClone = response.clone()
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone)
          })
        return response
      })
      .catch(async () => {
        // 网络失败，尝试从缓存读取
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(event.request)
        
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url)
          return cachedResponse
        }
        
        // 缓存也没有，返回离线页面
        console.log('[SW] Serving offline page for:', event.request.url)
        return cache.match(OFFLINE_URL)
      })
  )
})

// 消息处理 - 允许页面控制 SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested')
    self.skipWaiting()
  }
})

console.log('[SW] Service Worker loaded')
