self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/icon.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url,
        time: data.time,
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(clients.openWindow(urlToOpen));
  event.notification.close();
});
