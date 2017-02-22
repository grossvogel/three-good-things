const path = require('path');

function route(name) {
  return require(path.join(__dirname, '../routes/' + name));
}

module.exports = function(app) {
  app.use('/', route('index'));
  app.use('/good-things', route('good-things'));
  app.use('/subscriptions', route('subscriptions'));
  app.use('/auth', route('auth'));
};
