const React = require('react')
const auth = require('../auth')
const Loading = require('../components/loading')
const LoginComponent = require('../components/login')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      username: '',
      password: '',
      loginInProgress: false,
      newAccount: true,
      error: false
    }
  },
  componentWillMount: function () {
    if (auth.loggedIn()) {
      this.completeLogin()
    } else {
      auth.checkSession().then(function (user) {
        if (user) {
          auth.updateUser(user)
          this.completeLogin()
        } else {
          this.setState({
            loading: false
          })
        }
      }.bind(this)).catch(function (err) {
        console.log(err)
      })
    }
  },
  completeLogin: function () {
    let dest = auth.nextPathname() || '/'
    this.props.router.replace(dest)
  },
  handleUpdateUsername (e) {
    this.setState({
      username: e.target.value
    })
  },
  handleUpdatePassword (e) {
    this.setState({
      password: e.target.value
    })
  },
  handleToggleView (e) {
    e.preventDefault()
    this.setState({
      newAccount: !this.state.newAccount
    })
  },
  handleSubmission (e) {
    e.preventDefault()
    this.setState({
      loginInProgress: true
    })
    let submit = auth.signupOrLogin(this.state.username, this.state.password, this.state.newAccount)
    submit.then(function (user) {
      if (user) {
        auth.updateUser(user)
        this.completeLogin()
      } else {
        let msg = this.state.newAccount
          ? 'Sorry, it looks like the username you chose is already taken.'
          : 'Sorry, your login credentials could not be verified.'
        this.setState({
          error: msg,
          loginInProgress: false
        })
      }
    }.bind(this)).catch(function (err) {
      console.log(err)
      this.setState({
        error: 'Sorry, there was a problem validating your info.',
        loginInProgress: false
      })
    }.bind(this))
  },
  render: function () {
    if (this.state.loading) {
      return <Loading />
    } else if (this.state.loginInProgress) {
      return <div className='loading'>Login in progress...</div>
    }
    return (
      <LoginComponent
        username={this.state.username}
        password={this.state.password}
        newAccount={this.state.newAccount}
        error={this.state.error}
        onSubmit={this.handleSubmission}
        onToggleView={this.handleToggleView}
        onUpdateUsername={this.handleUpdateUsername}
        onUpdatePassword={this.handleUpdatePassword} />
    )
  }
})

