var express = require('express')
var router = express.Router()
var config = require('../config')

//  URLs used by react all send the single page markup
//  react router takes it from there
let frontEndURLs = ['/', '/day*', '/login', '/settings', '/history', '/image/*']
router.get(frontEndURLs, serveSinglePage)

//  for testing
router.get('/env', function (_req, res, _next) {
  res.send(config.env)
})

function serveSinglePage (req, res, next) {
  res.render('index', {
    title: 'Three Good Things',
    csrf: req.csrfToken(),
    pushServerKey: config.push.signingKeyPublic
  })
}

module.exports = router
