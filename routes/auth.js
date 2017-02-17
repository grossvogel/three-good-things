var express = require('express');
var router = express.Router();
var auth = appRequire('auth');

router.get('/me', auth.getCurrentUser);
router.post('/login', auth.processLogin);
router.post('/signup', auth.processSignup);
router.get('/google', auth.googleRedirect);
router.get('/google/callback', auth.googleCallback);

module.exports = router;
