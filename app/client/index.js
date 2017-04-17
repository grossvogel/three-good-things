import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import Day from './containers/day'
import Login from './containers/login'
import Settings from './components/settings'
import History from './containers/history'
import Image from './components/image'
import App from './components/app'
import auth from './auth'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

const loginCheck = auth.loginCheck()
const store = createStore(reducer, applyMiddleware(thunk))

const root = document.getElementById('reactRoot')
const routes = (
  <Provider store={store}>
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
  </Provider>
)

ReactDOM.render(routes, root)

