const CACHE_NAME = 'petit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다!',
    icon: '/icons/android/android-launchericon-192-192.png',
    badge: '/icons/android/android-launchericon-48-48.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icons/android/android-launchericon-48-48.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/android/android-launchericon-48-48.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Petit', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});