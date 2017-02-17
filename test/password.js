var assert = require('assert');
var util = require('./util.js');
var password = appRequire('password');

describe('Password Hashing', function() {
	it ('should match correctly', function(done) {
    var rawPW = '2389rdfasdnfauerfao9sdfjalskdfhq23';
    password.hash(rawPW).then(function(saltAndHash) {
      assert(saltAndHash.indexOf('#') == 32);
      password.check(rawPW, saltAndHash).then(function(valid) {
        assert(valid);
      });
    }).then(done).catch(function(err) {
      done(err);
    });
	});

	it ('should reject the wrong pw', function(done) {
    var rawPW = 'f290q3dasdfkasd23490asfdf';
    var wrongPW = 'f290q3dasdfkasd23490asfde';
    password.hash(rawPW).then(function(saltAndHash) {
      password.check(wrongPW, saltAndHash).then(function(valid) {
        assert(!valid);
      });
    }).then(done).catch(function(err) {
      done(err);
    });
	});
});
