const React = require('react')
const ReactDOM = require('react-dom')
const Day = require('./containers/day')
const Login = require('./containers/login')
const Settings = require('./components/settings')
const History = require('./containers/history')
const Image = require('./components/image')
const App = require('./components/app')
const auth = require('./auth')
const loginCheck = auth.loginCheck()
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

var root = document.getElementById('reactRoot')
var routes = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Day} onEnter={loginCheck} />
      <Route path='day/:date(/:editIndex)' component={Day} onEnter={loginCheck} />
      <Route path='settings' component={Settings} onEnter={loginCheck} />
      <Route path='history' component={History} onEnter={loginCheck} />
      <Route path='image/:filename' component={Image} onEnter={loginCheck} />
      <Route path='login' component={Login} />
    </Route>
  </Router>
)

ReactDOM.render(routes, root)

