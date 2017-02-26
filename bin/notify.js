#!/usr/bin/env node
const path = require('path')
global.appRequire = function (name) {
  return require(path.join(__dirname, '../app/' + name))
}
require('dotenv').config({path: path.join(__dirname, '../.env')})
const config = require('../config')
const db = appRequire('db')
const subscriptions = appRequire('subscriptions')

db(config)

var ignoreTime = process.argv[process.argv.length - 1] === '1'
subscriptions.remindAll(ignoreTime).then(function (reminders) {
  console.log('Reminders sent: ', reminders)
  process.exit(0)
}).catch(function (err) {
  console.log('Error sending reminders: ', err)
  process.exit(1)
})

