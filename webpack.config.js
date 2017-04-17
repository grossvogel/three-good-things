var path = require('path')

module.exports = {
  entry: path.join(__dirname, 'app/client/index.js'),
  output: { path: __dirname, filename: '/public/javascripts/bundle.js' },
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname, 'app/client'),
      loader: 'babel-loader',
      query: { presets: ['react'] }
    }]
  }
}
