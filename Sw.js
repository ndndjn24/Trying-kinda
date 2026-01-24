// sw.js - FH Decoder Service Worker
const CACHE_NAME = 'fh-decoder-v4';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. التثبيت
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching files...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Installation complete!');
        return self.skipWaiting();
      })
  );
});

// 2. التنشيط
self.addEventListener('activate', event => {
  console.log('[SW] Activated!');
  event.waitUntil(self.clients.claim());
});

// 3. التعامل مع الطلبات
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان في الكاش
        if (response) {
          return response;
        }
        
        // إذا لم يكن في الكاش
        return fetch(event.request)
          .catch(() => {
            // إذا فشل التحميل، نعيد الصفحة الرئيسية
            return caches.match('/index.html');
          });
      })
  );
});
