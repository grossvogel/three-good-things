const development = require('./development');
const production = require('./production');
const test = require('./test');
const envs = [ 'development', 'production', 'test' ];
const config = {};
const defaults = {
  base_url: process.env.BASE_URL,
  session_secret: process.env.SESSION_SECRET,
  session_duration: 24 * 30 * (60 * 60 * 1000),
  google: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET
  }
};

for(var i = 0; i < envs.length; i++) {
  config[envs[i]] = Object.assign({}, defaults, require('./' + envs[i]));
}

module.exports = config[process.env.NODE_ENV || 'development'];
