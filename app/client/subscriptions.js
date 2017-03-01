const api = require('./api')
const dateUtil = require('../date')

module.exports = {
  init: initialize,
  subscribe: subscribe,
  saveSubscription: saveSubscription,
  remove: remove
}

function initialize () {
  return registerServiceWorker('/service-worker.js')
  .then(getSubscriptionState)
  .then(fetchSubscriptionInfoFromServer)
  .catch(function (err) {
    console.log(err)
    return { subscription: null, enabled: false }
  })
}

function subscribe (hour, timezone) {
  return navigator.serviceWorker.ready.then(function (registration) {
    return registration.pushManager.subscribe({
      userVisibleOnly: true
    })
  }).then(function (rawPushSubscription) {
    return saveRawSubscription(rawPushSubscription, hour, timezone)
  })
}

function saveSubscription (subscription) {
  subscription.timezone = subscription.timezone || dateUtil.getTimezone()
  return api.post('/subscriptions', subscription)
}

function remove (subscriptionId) {
  return api.request('/subscriptions/' + subscriptionId, 'delete').then(function (result) {
    if (result.err) {
      return Promise.reject(result.err)
    }
  })
}

//  private helpers

function registerServiceWorker (script) {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register(script)
  } else {
    return Promise.reject('Service Workers not supported')
  }
}

function getSubscriptionState () {
  if (!('showNotification' in window.ServiceWorkerRegistration.prototype)) {
    return Promise.reject('Notifications not supported')
  }

  if (window.Notification.permission === 'denied') {
    return Promise.reject('User has denied permission to send notifications')
  }

  if (!('PushManager' in window)) {
    return Promise.reject('Push messaging not supported')
  }

  return navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    return serviceWorkerRegistration.pushManager.getSubscription()
  }).catch(function (_err) {
    return Promise.reject('Error fetching subscription')
  })
}

function fetchSubscriptionInfoFromServer (subscription) {
  var subscriptionInfo = parseEndpointAndId(subscription)
  return api.get('/subscriptions/' + subscriptionInfo.subscriptionId).then(function (result) {
    if (result.subscription) {
      return { subscription: result.subscription, enabled: true }
    } else {
      return { subscription: null, enabled: true }
    }
  })
}

function parseEndpointAndId (subscriptionInfo) {
  var endpoint = subscriptionInfo.endpoint
  var subscriptionId = subscriptionInfo.subscriptionId

  //  handle some different formats of GCM endpoints to make sure we
  //  always have the subscriptionId in the endpoint, and as its own value
  if (subscriptionId && endpoint.indexOf(subscriptionId) === -1) {
    endpoint += '/' + subscriptionId
  }
  if (!subscriptionId) {
    var pieces = endpoint.split('/')
    subscriptionId = pieces[pieces.length - 1]
  }
  return { endpoint: endpoint, subscriptionId: subscriptionId }
}

function saveRawSubscription (rawPushSubscription, hour, timezone) {
  let authKey = rawPushSubscription.keys && rawPushSubscription.keys.auth
  let p256dhKey = rawPushSubscription.keys && rawPushSubscription.keys.p256dh
  let {endpoint, subscriptionId} = parseEndpointAndId(rawPushSubscription)
  return saveSubscription({
    subscriptionId: subscriptionId,
    endpoint: endpoint,
    authKey: authKey,
    p256dhKey: p256dhKey,
    hour: hour,
    timezone: timezone
  }).then(function (result) {
    return result.subscription || Promise.reject(result.err)
  })
}

