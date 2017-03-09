/* eslint-env mocha */
var assert = require('assert')
require('./util.js')
var subscriptions = appRequire('subscriptions')
var dateUtil = appRequire('date')

describe('Subscriptions', function () {
  it('should only match the current hour', function (done) {
    let now = new Date()
    let sub = {}
    let localHour = parseInt(dateUtil.getHourInTimezone(now, sub.timezone))
    sub.timezone = dateUtil.getTimezone()
    for (let offset = 0; offset < 24; offset++) {
      sub.hour = (localHour + offset) % 24
      if (offset === 0) {
        assert(subscriptions._timeMatches(now, sub))
      } else {
        assert(!subscriptions._timeMatches(now, sub))
      }
    }
    done()
  })
})
