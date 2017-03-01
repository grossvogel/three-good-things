/* eslint-env mocha */
var assert = require('assert')
var util = require('./util.js')
var auth = appRequire('auth.js')
util.db(util.config)

describe('Authorization', function () {
  describe('Password Auth', function () {
    before(function (done) {
      util.dropCollection(['users', 'identities'], done)
    })

    it('fails for nonexistent user', function (done) {
      auth._passwordLogin('henry_user', 'password', function (_err, user) {
        assert(!user)
        done()
      })
    })

    it('creates a new user with pw credential', function (done) {
      var username = 'bobby'
      var rawPW = 'aeoifa8caw098e'
      auth._createUserWithPassword(username, rawPW).then(function (user) {
        assert(user)
        assert.equal(user.username, username)
        return user.id
      }).then(function (userId) {
        return new Promise(function (resolve, reject) {
          auth._passwordLogin(username, rawPW, function (_err, user) {
            assert(user)
            assert.equal(user.id, userId)
            resolve()
          })
        })
      }).then(done).catch(function (_err) {
        assert(false)
        done()
      })
    })
  })

  describe('Google Auth', function () {
    before(function (done) {
      util.dropCollection('users', function () {
        util.dropCollection('identities', done)
      })
    })

    it('creates a new user with google credentials', function (done) {
      var profile = {
        displayName: 'Jimmy User',
        id: '123'
      }
      new Promise(function (resolve, reject) {
        auth._googleLogin('accessToken', 'refreshToken', profile, function (_err, user) {
          assert(user)
          assert.equal(user.username, profile.displayName)
          resolve(user)
        })
      }).then(function (newUser) {
        auth._googleLogin('accessToken', 'refreshToken', profile, function (_err, user) {
          assert(user)
          assert.equal(user.username, profile.displayName)
          assert.equal(user.id, newUser.id)
          done()
        })
      }).catch(function (_err) {
        assert(false)
        done()
      })
    })
  })
})
