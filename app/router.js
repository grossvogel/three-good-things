const path = require('path')

function route (name) {
  return require(path.join(__dirname, '../routes/' + name))
}

module.exports = function (app) {
  app.use('/', route('front-end'))
  app.use('/good-things', route('good-things'))
  app.use('/subscriptions', route('subscriptions'))
  app.use('/uploads', route('uploads'))
  app.use('/auth', route('auth'))
}
