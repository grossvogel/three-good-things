const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();
const config = require('./config');
const sessions = require('client-sessions');
const csurf = require('csurf');

global.appRequire = function(name) {
	return require(path.join(__dirname, 'app/' + name));
};
const db = appRequire('db');
const router = appRequire('router');
const errors = appRequire('errors');
const auth = appRequire('auth');

const app = express();

// view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//	sessions & csrf
app.use(sessions({
  cookieName: 'session',
  secret: config.session_secret,
  duration: config.session_duration
}));
app.use(csurf({
  sessionKey: 'session'
}));
app.use(auth.loadUserFromSession);


//	misc setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: true,
  indentedSyntax: false,
  sourceMap: true,
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'public')));

router(app);
errors(app);

db(config);

module.exports = app;
