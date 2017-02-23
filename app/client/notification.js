const api = require('./api');
const dateUtil = require('../date');
const util = require('../util');

module.exports.init = function init() {
  return registerServiceWorker('/service-worker.js')
  .then(getSubscriptionState)
  .then(fetchSubscriptionInfoFromServer)
  .catch(function(err) {
    console.log(err);
    return { subscription: null, enabled: false };
  });
};

module.exports.saveSubscription = saveSubscription;

module.exports.subscribe = function subscribe(hour, timezone) {
  return navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.subscribe({
      userVisibleOnly: true
    });
  }).then(function (rawPushSubscription) {
    return saveRawSubscription(rawPushSubscription, hour, timezone);
  });
};

module.exports.remove = function remove(subscriptionId) {
  return api.request('/subscriptions/' + subscriptionId, 'delete').then(function(response) {
    return response.json();
  }).then(function(result) {
    if(result.err) {
      return Promise.reject(result.err);
    }
  });
};

function registerServiceWorker(script) {
  if('serviceWorker' in navigator) {
    return navigator.serviceWorker.register(script);
  } else {
    return Promise.reject('Service Workers not supported');
  }
}

function getSubscriptionState() {
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    return Promise.reject('Notifications not supported');
  }

  if (Notification.permission === 'denied') {
    return Promise.reject('User has denied permission to send notifications');
  }

  if (!('PushManager' in window)) {
    return Promise.reject('Push messaging not supported');
  }

  return navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    return serviceWorkerRegistration.pushManager.getSubscription();
  }).catch(function(err) {
    return Promise.reject('Error fetching subscription');
  });
}

function fetchSubscriptionInfoFromServer(subscription) {
  var subscriptionInfo = util.parseEndpointAndId(subscription);
  return api.get('/subscriptions/' + subscriptionInfo.subscriptionId).then(function(response) {
    return response.json();
  }).then(function(result) {
    if (result.subscription) {
      return { subscription: result.subscription, enabled: true };
    } else {
      return { subscription: null, enabled: true };
    }
  });
}

function saveSubscription(subscription) {
  subscription.timezone = subscription.timezone || dateUtil.getTimezone();
  return api.post('/subscriptions', subscription);
};

function saveRawSubscription(rawPushSubscription, hour, timezone) {
  var authKey = rawPushSubscription.keys && rawPushSubscription.keys.auth;
  var p256dhKey = rawPushSubscription.keys && rawPushSubscription.keys.p256dh;
  return saveSubscription({
    subscriptionId: rawPushSubscription.subscriptionId,
    endpoint: rawPushSubscription.endpoint,
    authKey: authKey,
    p256dhKey: p256dhKey,
    hour: hour,
    timezone: timezone
  }).then(function(response) {
    return response.json();
  }).then(function(result) {
    return result.subscription || Promise.reject(result.err);
  });
}
