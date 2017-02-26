/* eslint-env mocha */
var assert = require('assert')
var util = require('./util.js')
var User = appRequire('model/user')
util.db(util.config)

describe('New User', function () {
  beforeEach(function (done) {
    util.dropCollection('users', done)
  })

  it('should have create time', function (done) {
    var dan = new User({
      username: 'dan_the_man'
    })
    dan.save(function (err) {
      if (err) throw err
      assert(dan.created_at)
      done()
    })
  })

  it('should be the only user', function (done) {
    var dan = new User({
      username: 'dan_the_man'
    })
    dan.save(function (_err) {
      User.find({}, function (err, users) {
        if (err) throw err
        assert(users.length === 1)
        assert.equal(users[0].id, dan.id)
        done()
      })
    })
  })

  it('should require a username', function (done) {
    var dan = new User({})
    dan.save(function (err) {
      assert.equal(err.errors['username'], 'Path `username` is required.')
      User.find({}, function (err, users) {
        if (err) throw err
        assert(users.length === 0)
        done()
      })
    })
  })
})
