const express = require('express')
const router = express.Router()
const auth = appRequire('auth')
const config = require('../config')

auth.initLocalLogin(config)
auth.initGoogleLogin(config)
router.get('/me', auth.getCurrentUser)
router.post('/login', auth.processLogin)
router.post('/signup', auth.processSignup)
router.get('/google', auth.googleRedirect)
router.get('/google/callback', auth.googleCallback)

module.exports = router
