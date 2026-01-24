// FH Decoder v3 - Service Worker
const CACHE_NAME = 'fh-decoder-v3';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  // سيتم إضافة CSS وJS لاحقاً إذا فصلتهما
];

// عند التثبيت
self.addEventListener('install', event => {
  console.log('📱 FH Decoder v3: Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('💾 Caching app shell...');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// عند التنشيط
self.addEventListener('activate', event => {
  console.log('🚀 FH Decoder v3: Service Worker activated!');
  event.waitUntil(self.clients.claim());
});

// التعامل مع الطلبات
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد في الكاش
        if (response) {
          return response;
        }
        
        // إذا لم يجده، يحاول من الشبكة
        return fetch(event.request)
          .then(networkResponse => {
            // تخزين في الكاش للاستخدام المستقبلي
            if (event.request.method === 'GET') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // إذا فشل الاتصال، نعيد الصفحة الرئيسية
            return caches.match('/index.html');
          });
      })
  );
});
