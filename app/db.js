const mongoose = require('mongoose')
mongoose.Promise = Promise

module.exports = function (config) {
  if (mongoose.connection.readyState === 0) {
    mongoose.set('debug', config.debug)
    mongoose.connect(config.db).connection
      .on('error', console.log)
  }
}

