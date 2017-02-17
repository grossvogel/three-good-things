const path = require('path');

function route(name) {
  return require(path.join(__dirname, '../routes/' + name));
}

module.exports = function(app) {
  app.use('/', route('index'));
  app.use('/api', route('api'));
  app.use('/auth', route('auth'));
};
