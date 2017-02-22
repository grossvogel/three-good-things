const express = require('express');
const router = express.Router();
const subscriptions = appRequire('subscriptions');
const auth = appRequire('auth');

router.use(auth.requireUser);
router.post('/', subscriptions.save);

module.exports = router;
