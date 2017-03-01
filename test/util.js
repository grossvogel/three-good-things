const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

global.appRequire = function (name) {
  return require(path.join(__dirname, '../app/' + name))
}

module.exports = {
  config: require('../config'),
  db: appRequire('db'),
  dropCollection: function (collections, done) {
    if (collections.constructor !== Array) {
      collections = [collections]
    }
    let promises = []
    for (let i = 0; i < collections.length; i++) {
      promises.push(new Promise(function (resolve, reject) {
        mongoose.connection.collections[collections[i]].drop(function () {
          resolve()
        })
      }))
    }
    Promise.all(promises).then(function () {
      done()
    })
  }
}
