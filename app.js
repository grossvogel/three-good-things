'use strict'
const express = require('express')
const path = require('path')
require('dotenv').config()
const config = require('./config')

//  app code
global.appRequire = function (name) {
  return require(path.join(__dirname, 'app/' + name))
}
const db = appRequire('db')
const router = appRequire('router')
const errors = appRequire('errors')
const middleware = appRequire('middleware')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

middleware(app, config)
router(app)
errors(app)

db(config)

module.exports = app
