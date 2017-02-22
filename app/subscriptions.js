const request = require('request');
const config = require('../config');
const dateUtil = appRequire('date');
const ReminderSubscription = appRequire('model/reminder-subscription');
const goodThings = appRequire('good-things');

module.exports.save = function(req, res, _next) {
  const subscription = extractSubscription(req);
  saveSubscription(req.user, subscription).then(function(sub) {
    res.json({ err: null, subscription: sub});
  }).catch(function(err) {
    res.json({ err: err, subscription: null});
  });
};

module.exports.remindAll = function remindAll(ignoreTime) {
  var now = new Date();
  return ReminderSubscription.find().then(function(subscriptions) {
    var requests = [];
    subscriptions.forEach(function(subscription) {
      if (ignoreTime || timeMatches(now, subscription)) {
        requests.push(remindIfNecessary(subscription));
      }
    });
    return Promise.all(requests).then(function(values) {
      return values;
    });
  });
};

function extractSubscription(req) {
  var endpoint = req.body.endpoint;
  var subscriptionId = req.body.subscriptionId;
  
  //  handle some different formats of GCM endpoints to make sure we
  //  always have the subscriptionId in the endpoint, and as its own value
  if (endpoint.indexOf('https://android.googleapis.com/gcm/send') === 0) {
    if (subscriptionId && endpoint.indexOf(subscriptionId) === -1) {
      endpoint += '/' + subscriptionId;
    }
    if (!subscriptionId) {
      var pieces = endpoint.split('/');
      subscriptionId = pieces[pieces.length - 1];
    }
  }

  return {
    endpoint: endpoint,
    subscriptionId: subscriptionId,
    authKey: req.body.keys.auth,
    p256dhKey: req.body.keys.p256dh,
    timezone: req.body.timezone || 'America/Chicago',
    hour: req.body.hour || 18,
  };
}

function saveSubscription(user, subscription) {
  var query = ReminderSubscription.findOne({ user: user })
  return query.then(function(existing) {
    if (!existing) return Promise.reject();

    existing.endpoint = subscription.endpoint;
    existing.subscriptionId = subscription.subscriptionId;
    existing.timezone = subscription.timezone;
    existing.hour = subscription.hour;
    existing.authKey = subscription.authKey;
    existing.p256dhKey = subscription.p256dhKey;
    return existing.save();
  }).catch(function() {
    subscription.user = user;
    var newSub = new ReminderSubscription(subscription);
    return newSub.save();
  });
}

function remindIfNecessary(subscription) {
  var now = new Date();
  var date = dateUtil.getDateInTimezone(now, subscription.timezone);
  return goodThings.fetchDay(subscription.user, date).then(function(things) {
    if (things && things.length > 2) {
      return false;
    } else {
      return true;
    }
  }).catch(function(err) {
    return true;
  }).then(function(sendReminder) {
    return sendReminder ? remind(subscription) : 0;
  });
}

function remind(subscription) {
  var endpoint = 'https://fcm.googleapis.com/fcm/send';
  return new Promise(function(resolve, reject) {
    request({
      url: endpoint,
      method: 'POST',
      json: true,
      body: {
        registration_ids: [ subscription.subscriptionId ],
      },
      headers: {
        Authorization: 'key=' + config.push.serverKey
      }
    }, function(err, response, body) {
      resolve(1);
    });
  });
};

function timeMatches(now, subscription) {
  return dateUtil.getHourInTimezone(now, subscription.timezone) == subscription.hour;
}
