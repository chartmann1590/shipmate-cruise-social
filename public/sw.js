const CACHE_NAME = 'shipmate-shell-v2';
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');
firebase.initializeApp({ apiKey: 'AIzaSyAkUocHhJY3Uszj6pAkL9db-WmGnf-LGKw', authDomain: 'shipmate-cruise-social-2026.firebaseapp.com', projectId: 'shipmate-cruise-social-2026', storageBucket: 'shipmate-cruise-social-2026.firebasestorage.app', messagingSenderId: '298212957247', appId: '1:298212957247:web:220acd133594164664ec8a' });
const messaging = firebase.messaging();
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/hero_banner.jpg', '/deck_lounge.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.url.includes('firestore.googleapis.com') || request.url.includes('googleapis.com/google.firestore')) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    return response;
  })));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/?tab=chats';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => 'focus' in client);
    return existing ? existing.focus().then(() => existing.navigate(target)) : clients.openWindow(target);
  }));
});

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'ShipMate';
  const options = { body: payload.notification?.body || 'New activity from your sailing.', icon: '/favicon.svg', badge: '/favicon.svg', data: { url: payload.fcmOptions?.link || '/?tab=chats' } };
  self.registration.showNotification(title, options);
});
