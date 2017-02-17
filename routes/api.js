var express = require('express');
var router = express.Router();
var auth = appRequire('auth');

//  @TODO
router.post('/day', function(req, res, next) {
  next();
});

module.exports = router;
