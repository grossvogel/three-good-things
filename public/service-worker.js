'use strict'

/* eslint-env serviceworker */
self.addEventListener('push', function (event) {
  var title = 'it\'s time for good things'
  var body = 'click to record today\'s good things'
  var icon = '/favicon.png'
  var tag = 'three-good-things-notification'

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close()

  // focus on existing tab (if the app is open) or open a new one
  /* global clients */
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if ((client.url.indexOf(self.location.host) !== -1) && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/')
    }
  }))
})
