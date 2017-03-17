/* eslint-env mocha */
const assert = require('assert')
const app = require('../app')
const session = require('supertest-session')
const cheerio = require('cheerio')
const util = require('./util')
const dateUtil = appRequire('date')

describe('API', function () {
  let username, password

  before(function (done) {
    username = randomString(12)
    password = randomString(12)
    util.db(util.config)
    util.dropCollection(['users', 'goodthings'], done)
  })

  it('should be running in testing mode', function (done) {
    newSession().get('/env')
      .expect(200)
      .end(function (err, res) {
        if (err) done(err)
        assert.equal(res.text, 'test')
        done()
      })
  })

  describe('Password Auth', function () {
    let testSession
    beforeEach(function () {
      testSession = newSession()
    })
    it('should allow creating a new user', function (done) {
      signup(testSession, username, password).then(function () {
        verifyCurrentUser(testSession, username, done)
      }).catch(function (err) {
        done(err)
      })
    })

    it('should log in the user', function (done) {
      login(testSession, username, password).then(function () {
        verifyCurrentUser(testSession, username, done)
      }).catch(function (err) {
        done(err)
      })
    })
  })

  describe('Good Things', function () {
    let testSession, csrfToken, today
    before(function (done) {
      testSession = newSession()
      today = dateUtil.today()
      login(testSession, username, password).then(function (token) {
        csrfToken = token
        done()
      }).catch(function (err) {
        done(err)
      })
    })

    it('should begin with no good things', function (done) {
      getGoodThings(testSession, today).then(function (result) {
        assert.equal(result.err, null)
        assert.equal(result.goodThings.length, 0)
        done()
      }).catch(function (err) {
        done(err)
      })
    })

    it('should save and return a good thing', function (done) {
      let title = 'first test good thing'
      let details = 'first thing details'
      let data = {day: dateUtil.stringify(today), title: title, details: details}
      post(testSession, '/good-things', data, csrfToken, 201).then(function (result) {
        assert.equal(result.err, null)
        assert.ok(result.goodThing._id)
        assert.equal(result.goodThing.title, title)
        assert.equal(result.goodThing.details, details)
        done()
      }).catch(function (err) {
        done(err)
      })
    })

    it('should edit and save an existing good thing', function (done) {
      let newTitle = 'updated first test good thing'
      let newDetails = 'first thing details have been edited'
      let found = null

      getGoodThings(testSession, today).then(function (result) {
        return result.goodThings[0]
      }).then(function (goodThing) {
        found = goodThing
        let data = {id: found._id, title: newTitle, details: newDetails, day: dateUtil.stringify(today)}
        return post(testSession, '/good-things', data, csrfToken, 200)
      }).then(function (result) {
        assert.equal(result.err, null)
        assert.equal(result.goodThing._id, found._id)
        assert.equal(result.goodThing.title, newTitle)
        assert.equal(result.goodThing.details, newDetails)
        return true
      }).then(function () {
        getGoodThings(testSession, today).then(function (result) {
          assert.equal(result.goodThings.length, 1)
          done()
        })
      }).catch(function (err) {
        done(err)
      })
    })

    it('should save a second good thing', function (done) {
      let title = 'second test good thing'
      let details = 'second thing details'
      let data = {day: dateUtil.stringify(today), title: title, details: details}
      post(testSession, '/good-things', data, csrfToken, 201).then(function (result) {
        return getGoodThings(testSession, today)
      }).then(function (result) {
        assert.equal(result.goodThings.length, 2)
        done()
      }).catch(function (err) {
        done(err)
      })
    })
  })

  describe('Notification Subscriptions', function () {
    let testSession, csrfToken
    let subInfo = {
      endpoint: 'https://random-endpoint.com/abc/123456',
      subscriptionId: '123456',
      timezone: 'America/Los_Angeles',
      hour: 18
    }
    before(function (done) {
      testSession = newSession()
      login(testSession, username, password).then(function (token) {
        csrfToken = token
        done()
      }).catch(function (err) {
        done(err)
      })
    })

    it('should create a new subscription', function (done) {
      post(testSession, '/subscriptions', subInfo, csrfToken, 201).then(function (result) {
        assert.equal(result.subscription.subscriptionId, subInfo.subscriptionId)
        assert.equal(result.subscription.timezone, subInfo.timezone)
        assert.equal(result.subscription.hour, subInfo.hour)
        assert.equal(result.subscription.endpoint, subInfo.endpoint)
        done()
      })
    })

    it('should fetch an existing subscription', function (done) {
      testSession.get('/subscriptions/' + subInfo.subscriptionId)
        .expect(200)
        .end(function (err, res) {
          if (err) assert.fail(err)
          assert.equal(res.body.subscription.subscriptionId, subInfo.subscriptionId)
          assert.equal(res.body.subscription.timezone, subInfo.timezone)
          assert.equal(res.body.subscription.hour, subInfo.hour)
          assert.equal(res.body.subscription.endpoint, subInfo.endpoint)
          done()
        })
    })

    it('should delete an existing subscription', function (done) {
      new Promise(function (resolve, reject) {
        testSession.delete('/subscriptions/' + subInfo.subscriptionId)
          .set('X-CSRF-Token', csrfToken)
          .expect(202)
          .end(function (err, res) {
            if (err) reject(err)
            assert.equal(res.body.err, null)
            resolve()
          })
      }).then(function () {
        testSession.get('/subscriptions/' + subInfo.subscriptionId)
          .expect(404)
          .end(function (err, res) {
            if (err) assert.fail(err)
            assert.equal(res.body.err, 'File Not Found')
            done()
          })
      }).catch(function (err) {
        done(err)
      })
    })
  })
})

function newSession () {
  return session(app)
}

function verifyCurrentUser (testSession, username, done) {
  testSession
    .get('/auth/me')
    .expect(200)
    .end(function (err, res) {
      if (err) assert.fail(err)
      assert.equal(res.body.user.username, username)
      done()
    })
}

function signup (testSession, username, password) {
  return getCSRFToken(testSession).then(function (token) {
    return authRequest(testSession, 'signup', username, password, token)
  })
}

function login (testSession, username, password) {
  return getCSRFToken(testSession).then(function (token) {
    return authRequest(testSession, 'login', username, password, token)
  })
}

function authRequest (testSession, type, username, password, csrfToken) {
  let endpoint = '/auth/' + type
  let data = {username: username, password: password}
  let expectedStatus = type === 'signup' ? 201 : 200
  return post(testSession, endpoint, data, csrfToken, expectedStatus)
    .then(function (result) {
      assert.equal(result.user.username, username)
      return csrfToken
    })
}

function getCSRFToken (testSession) {
  return new Promise(function (resolve, reject) {
    testSession.get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) reject(err)
        resolve(findCSRFTokenInDocument(res.text))
      })
  })
}

function findCSRFTokenInDocument (pageBody) {
  let dom = cheerio.load(pageBody)
  return dom('input#csrf').val()
}

function randomString (length, chars) {
  if (!chars) {
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function getGoodThings (testSession, date) {
  return new Promise(function (resolve, reject) {
    testSession.get('/good-things/' + dateUtil.stringify(date))
      .expect(200)
      .end(function (err, res) {
        if (err) reject(err)
        resolve(res.body)
      })
  })
}

function post (testSession, endpoint, data, csrfToken, expectedStatus) {
  expectedStatus = expectedStatus || 200
  return new Promise(function (resolve, reject) {
    testSession.post(endpoint)
      .send(data)
      .set('Accept', 'application/json')
      .set('X-CSRF-Token', csrfToken)
      .expect(expectedStatus)
      .end(function (err, res) {
        if (err) reject(err)
        resolve(res.body)
      })
  })
}
