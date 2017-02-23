const React = require('react');
const ReactDOM = require('react-dom');
const Day = require('./day');
const Login = require('./login');
const Settings = require('./settings');
const App = require('./app');
const auth = require('./auth');
const loginCheck = auth.loginCheck();
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

var root = document.getElementById('reactRoot');
var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Day} onEnter={loginCheck}/>
      <Route path="day/:date(/:editIndex)" component={Day} onEnter={loginCheck}/>
      <Route path="settings" component={Settings} onEnter={loginCheck}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, root);

