const api = require('./api');

module.exports.init = function init() {
  return registerServiceWorker('/service-worker.js').then(function(val) {
    return getSubscriptionState();
  });
};

module.exports.saveSubscription = function saveSubscription(subscription) {
  return api.post('/subscriptions', subscription);
};

module.exports.subscribe = function subscribe() {
  return navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.subscribe({
      userVisibleOnly: true
    });
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

//  this may not be necessary?
function appServerKey() {
  var rawBytes = document.getElementById('pushServerKey').value;
  var arr = [];
  for (var i = 0; i < rawBytes.length; i += 2) {
    arr.push(parseInt(rawBytes.substring(i, i + 2), 16));
  }
  return new Uint8Array(arr);
}
