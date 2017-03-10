const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const sessions = require('client-sessions')
const csurf = require('csurf')
const sass = require('node-sass-middleware')
const helmet = require('helmet')
const auth = appRequire('auth')

module.exports = function (app, config) {
  app.use(httpsRedirect(config))
  app.use(helmet(helmetOptions()))

  // sessions & csrf
  app.use(sessions({
    cookieName: 'session',
    secret: config.session_secret,
    duration: config.session_duration
  }))
  app.use(csurf({sessionKey: 'session'}))
  app.use(auth.loadUserFromSession)

  //  standard stuff
  app.use(favicon(path.join(__dirname, '../public', 'favicon.png')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())

  if (config.env !== 'test') app.use(logger('dev'))
  app.use(sass({
    src: path.join(__dirname, '../scss'),
    dest: path.join(__dirname, '../public/stylesheets'),
    debug: true,
    indentedSyntax: false,
    sourceMap: true,
    prefix: '/stylesheets'
  }))
  app.use(express.static(path.join(__dirname, '../public')))

  app.use(passport.initialize())
}

function httpsRedirect (config) {
  return function (req, res, next) {
    if (
      !req.secure &&
      req.get('x-forwarded-proto') !== 'https' &&
      config.env === 'production'
    ) {
      return res.redirect('https://' + req.get('host') + req.url)
    }
    next()
  }
}

function helmetOptions () {
  return {
    noCache: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ['fonts.googleapis.com', "'self'"],
        fontSrc: ['fonts.gstatic.com', 'data:']
      }
    }
  }
}
