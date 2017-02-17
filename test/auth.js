var assert = require('assert');
var util = require('./util.js');
var auth = appRequire('auth.js');
util.db(util.config);

describe('Authorization', function() {
  describe('Password Auth', function() {
    before(function(done) {
      util.dropCollection('users', function () {
        util.dropCollection('identities', done);
      });
    });

    it('fails for nonexistent user', function(done) {
      auth.passwordLogin('henry_user', 'password', function(err, user) {
        assert(!user);
        done();
      });
    });

    it('creates a new user with pw credential', function(done) {
      var username = 'bobby';
      var rawPW = 'aeoifa8caw098e';
      auth.createUserWithPassword(username, rawPW).then(function(user) {
        assert(user);
        assert.equal(user.username, username);
        return user.id;
      }).then(function(userId) {
        return new Promise(function(resolve, reject) {
          auth.passwordLogin(username, rawPW, function (err, user) {
            assert(user);
            assert.equal(user.id, userId);
            resolve();
          });
        });
      }).then(done).catch(function(err) {
        assert(false);
        done();
      });
    });
  });

  describe('Google Auth', function() {
    before(function(done) {
      util.dropCollection('users', function () {
        util.dropCollection('identities', done);
      });
    });

    it('creates a new user with google credentials', function(done) {
      var profile = {
        displayName: 'Jimmy User',
        id: '123',
      };
      var create = new Promise(function(resolve, reject) {
        auth.googleLogin('accessToken', 'refreshToken', profile, function(err, user) {
          assert(user);
          assert.equal(user.username, profile.displayName);
          resolve(user);
        });
      }).then(function(newUser) {
        auth.googleLogin('accessToken', 'refreshToken', profile, function(err, user) {
          assert(user);
          assert.equal(user.username, profile.displayName);
          assert.equal(user.id, newUser.id);
          done();
        });
      }).catch(function(err) {
        assert(false);
        done();
      });
    });
  });
});
