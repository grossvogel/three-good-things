var express = require('express');
var router = express.Router();
var goodThings = appRequire('good-things');
var auth = appRequire('auth');

router.use(auth.requireUser);
router.get('/:date', goodThings.day);
router.post('/', goodThings.update);

module.exports = router;
