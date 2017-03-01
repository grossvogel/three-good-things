const api = require('./api')

//  private singleton state
var user = null
var nextPathname = null

module.exports = {
  currentUser: function () {
    return user
  },
  loggedIn: function () {
    return !!user
  },
  updateUser: function (newUser) {
    user = newUser
  },
  loginCheck: function () {
    return function (nextState, replace) {
      if (!this.loggedIn()) {
        nextPathname = nextState.location.pathname
        replace({ pathname: '/login' })
      }
    }.bind(this)
  },
  nextPathname: function () {
    var tmp = nextPathname
    nextPathname = null
    return tmp
  },
  checkSession: function () {
    return api.get('/auth/me').then(function (result) {
      return result.user
    })
  },
  signupOrLogin: function (username, password, newAccount) {
    var endpoint = newAccount ? '/auth/signup' : '/auth/login'
    var data = {username: username, password: password}
    return api.post(endpoint, data).then(function (result) {
      return result.user
    }).catch(function (err) {
      console.log(err)
      return null
    })
  }
}

