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

  // This looks to see if the current is already open and focus instead of opening
  /* global clients */
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if ((client.url === '/' || client.url === '/#/') && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/')
    }
  }))
})
