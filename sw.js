const CACHE_NAME = 'fh-decoder-v10';
const ASSETS = [
  './',
  './index.html'
];

// 1. التثبيت وتخزين كافة الملفات فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // تفعيل الخدمة فوراً بدون الانتظار
});

// 2. تنظيف أي كاش قديم عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // السيطرة على الصفحة فوراً
});

// 3. استراتيجية Cache First: الأولوية المطلقة للكاش الداخلي
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // إرجاع النسخة المحفوظة فوراً وبدون تردد
      }
      return fetch(event.request); // إذا لم توجد (في المرة الأولى فقط) يجلبها من النت
    })
  );
});
