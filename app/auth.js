const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');
const Identity = appRequire('model/identity');
const User = appRequire('model/user');
const password = appRequire('password');

//  passport config
passport.use(new LocalStrategy(passwordLogin));
passport.use(new GoogleStrategy({
  clientID: config.google.id,
  clientSecret: config.google.secret,
  callbackURL: config.base_url + '/auth/google/callback' },
  googleLogin
));

//  exports
module.exports.getCurrentUser = function getCurrentUser(req, res, _next) {
  var user = req.session.user || null;
  return res.json({ err: null, user: user });
};

module.exports.processSignup = function processSignup(req, res, _next) {
  createUserWithPassword(req.body.username, req.body.password).then(function(user) {
    if(user) {
      req.session.user = user;
    }
    res.json({ err: null, user: user });
  }).catch(function(err) {
    res.json({ err: err, user: null });
  });
};

module.exports.processLogin = function processLogin(req, res, next) {
  passport.authenticate('local', function(err, user, _info) {
    if (err) { return next(err); }
    if (!user) {
      return res.json({ err: 'Login info could not be verified', user: null });
    } else {
      req.session.user = user;
      return res.json({ err: null, user: user });
    }
  })(req, res, next);
};

module.exports.googleRedirect = passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' });
module.exports.googleCallback = function googleCallback(req, res, next) {
  passport.authenticate('google', function(err, user, _info) {
    if(user) {
      req.session.user = user;
    }
    res.redirect('/');
  })(req, res, next);
};

module.exports.googleLogin = googleLogin;
module.exports.passwordLogin = passwordLogin;
module.exports.createUserWithPassword = createUserWithPassword;

//  logic
function newUser(username) {
  var user = new User({
    username: username
  });
  return user.save();
}
function getIdentity(provider, key) {
  return Identity.findOne({ provider: provider, key: key }).exec();
}

function googleLogin (accessToken, refreshToken, profile, done) {
  var userLookup = getUserFromIdentity(Identity.provider.google, profile.id);
  userLookup.then(function(user) {
    return user || createGoogleUser(profile);
  }).then(function(user) {
    done(null, user);
  }).catch(function(err) {
    done(err, null);
  });
}
function getUserFromIdentity(provider, key) {
  return getIdentity(provider, key).then(function(identity) {
    if(identity) {
      return User.findById(identity.user).exec();
    } else {
      return null;
    }
  });
}
function createGoogleUser(profile) {
  return newUser(profile.displayName).then(function(user) {
    return createGoogleIdForUser(user, profile);
  });
}
function createGoogleIdForUser(user, profile) {
  var identity = new Identity({
    user: user.id,
    provider: Identity.provider.google,
    key: profile.id
  });
  return identity.save().then(function(_identity) {
    return user;
  });
}

function passwordLogin(username, rawPW, done) {
  lookupByPassword(username, rawPW).then(function(user) {
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  }).catch(function(err) {
    done(err, null);
  });
}
function lookupByPassword(username, rawPW) {
  var idLookup = getIdentity(Identity.provider.local, username);
  return idLookup.then(function(identity) {
    if (identity) {
      return getUserIfPasswordMatches(identity, rawPW);
    } else {
      return false;
    }
  });
}
function getUserIfPasswordMatches(identity, rawPW) {
  return password.check(rawPW, identity.secret).then(function(valid) {
    return valid && User.findById(identity.user).exec();
  });
}

function createUserWithPassword(username, rawPW) {
  return newUser(username).then(function(user) {
    return createLocalIdentityForUser(user, rawPW);
  });
}
function createLocalIdentityForUser(user, rawPW) {
  return password.hash(rawPW).then(function(saltAndHashedPW) {
    var identity = new Identity({
      user: user.id,
      provider: Identity.provider.local,
      key: user.username,
      secret: saltAndHashedPW
    });
    return identity.save();
  }).then(function(_identity) {
    return user;
  });
}
