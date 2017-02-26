const express = require('express')
const router = express.Router()
const subscriptions = appRequire('subscriptions')
const auth = appRequire('auth')

router.use(auth.requireUser)
router.post('/', subscriptions.save)
router.get('/:subscriptionId', subscriptions.get)
router.delete('/:subscriptionId', subscriptions.remove)

module.exports = router
