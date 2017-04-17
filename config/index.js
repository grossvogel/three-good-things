const envs = [ 'development', 'production', 'test' ]
const config = {}
const defaults = {
  env: process.env.NODE_ENV,
  base_url: process.env.BASE_URL,
  session_secret: process.env.SESSION_SECRET,
  session_duration: 24 * 30 * (60 * 60 * 1000),
  google: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    defaultRegion: process.env.AWS_REGION,
    S3Bucket: 'three-good-things'
  },
  push: {
    serverKey: process.env.PUSH_MSG_SERVER_KEY,
    signingKeyPublic: process.env.PUSH_MSG_KEY_PUBLIC,
    signingKeyPrivate: process.env.PUSH_MSG_KEY_PUBLIC
  }
}

for (var i = 0; i < envs.length; i++) {
  config[envs[i]] = Object.assign({}, defaults, require('./' + envs[i]))
}

module.exports = config[process.env.NODE_ENV || 'development']
