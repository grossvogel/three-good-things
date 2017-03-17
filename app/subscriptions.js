const request = require('request')
const config = require('../config')
const dateUtil = appRequire('date')
const ReminderSubscription = appRequire('model/reminder-subscription')
const goodThings = appRequire('good-things')

module.exports = {
  save,
  get,
  remove,
  remindAll,

  //  private... exported for testing
  _timeMatches: timeMatches
}

const PushService = {
  Chrome: 'Chrome',
  Firefox: 'Firefox',
  Unknown: 'Unknown'
}
const PushEndpoint = {
  GCM: 'https://android.googleapis.com/gcm/send/',
  FCM: 'https://fcm.googleapis.com/fcm/send',
  Firefox: 'https://updates.push.services.mozilla.com/wpush/v1'
}

function save (req, res, _next) {
  const subscription = extractSubscription(req)
  saveSubscription(req.user, subscription).then(function (subInfo) {
    res.status(subInfo.new ? 201 : 200)
      .json({err: null, subscription: subInfo.subscription})
  }).catch(function (err) {
    res.json({err: err, subscription: null})
  })
}

function get (req, res, _next) {
  const subscriptionId = req.params.subscriptionId
  findSubscription(req.user, subscriptionId).then(function (subscription) {
    if (subscription) {
      res.json({err: null, subscription: subscription})
    } else {
      return Promise.reject(new Error('File Not Found'))
    }
  }).catch(function (err) {
    res.status(404).json({err: err.message, subscription: null})
  })
}

function remove (req, res, _next) {
  const subscriptionId = req.params.subscriptionId
  removeSubscription(req.user, subscriptionId).then(function () {
    res.status(202).json({err: null})
  }).catch(function (err) {
    res.json({err: err})
  })
}

function remindAll (ignoreTime) {
  var now = new Date()
  return ReminderSubscription.find().then(function (subscriptions) {
    var requests = []
    subscriptions.forEach(function (subscription) {
      if (ignoreTime || timeMatches(now, subscription)) {
        requests.push(remindIfNecessary(subscription))
      }
    })
    return Promise.all(requests).then(function (values) {
      return values
    }).catch(function (err) {
      console.log(err)
    })
  })
}

//  private helpers

function extractSubscription (req) {
  var subscription = {
    endpoint: req.body.endpoint,
    subscriptionId: req.body.subscriptionId,
    timezone: req.body.timezone || 'America/Chicago',
    hour: req.body.hour || 18
  }
  if (req.body.p256dhKey) {
    subscription.p256dhKey = req.body.p256dhKey
  }
  if (req.body.authKey) {
    subscription.authKey = req.body.authKey
  }
  return subscription
}

function saveSubscription (user, subscription) {
  let newSub
  let query = findSubscription(user, subscription.subscriptionId)
  return query.then(function (existing) {
    if (!existing) return Promise.reject(new Error('Subscription does not exist yet'))

    existing.endpoint = subscription.endpoint
    existing.timezone = subscription.timezone
    existing.hour = subscription.hour
    existing.authKey = subscription.authKey
    existing.p256dhKey = subscription.p256dhKey
    return existing.save()
  }).catch(function () {
    subscription.user = user
    newSub = new ReminderSubscription(subscription)
    return newSub.save()
  }).then(function (subscription) {
    return {subscription: subscription, 'new': !!newSub}
  })
}

function findSubscription (user, subscriptionId) {
  return ReminderSubscription.findOne({
    user: user,
    subscriptionId: subscriptionId
  })
}

function removeSubscription (user, subscriptionId) {
  return ReminderSubscription.remove({
    user: user,
    subscriptionId: subscriptionId
  })
}

function remindIfNecessary (subscription) {
  var now = new Date()
  var date = dateUtil.getDateInTimezone(now, subscription.timezone)
  return goodThings.fetchDay(subscription.user, date).then(function (things) {
    if (things && things.length > 2) {
      return false
    } else {
      return true
    }
  }).catch(function (_err) {
    return true
  }).then(function (sendReminder) {
    return sendReminder ? remind(subscription) : 0
  })
}

function remind (subscription) {
  switch (getPushService(subscription)) {
    case PushService.Chrome:
      return remindChrome(subscription)
    case PushService.Firefox:
      return remindFirefox(subscription)
    default:
      return Promise.reject(new Error('Unknown Push Service'))
  }
}

function getPushService (subscription) {
  if (subscription.endpoint.indexOf(PushEndpoint.GCM) !== -1 ||
      subscription.endpoint.indexOf(PushEndpoint.FCM) !== -1) {
    return PushService.Chrome
  } else if (subscription.endpoint.indexOf(PushEndpoint.Firefox) !== -1) {
    return PushService.Firefox
  } else {
    return PushService.Unknown
  }
}

function remindChrome (subscription) {
  let fcmEndpoint = 'https://fcm.googleapis.com/fcm/send'
  return new Promise(function (resolve, reject) {
    request({
      url: fcmEndpoint,
      method: 'POST',
      json: true,
      body: {
        registration_ids: [ subscription.subscriptionId ]
      },
      headers: {
        Authorization: 'key=' + config.push.serverKey
      }
    }, function (err, response, body) {
      if (err) {
        reject(err)
      } else {
        resolve(1)
      }
    })
  })
}

function remindFirefox (subscription) {
  return Promise.reject(new Error('Firefox notifications not implemented yet'))
}

function timeMatches (now, subscription) {
  let match = dateUtil.getHourInTimezone(now, subscription.timezone) === subscription.hour
  return match
}
