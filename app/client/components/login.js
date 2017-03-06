const React = require('react')
const auth = require('../auth')
const InputRow = require('./input-row')
const Loading = require('./loading')

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
    var dest = auth.nextPathname() || '/'
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
    var submit = auth.signupOrLogin(this.state.username, this.state.password, this.state.newAccount)
    submit.then(function (user) {
      if (user) {
        auth.updateUser(user)
        this.completeLogin()
      } else {
        this.setState({
          error: true,
          loginInProgress: false
        })
      }
    }.bind(this)).catch(function (err) {
      console.log(err)
      this.setState({
        error: true,
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

function LoginComponent (props) {
  var title = props.newAccount ? 'Create your account to begin' : 'Sign in to your account'
  var toggle = props.newAccount ? '(sign in)' : '(create an account)'
  var buttonText = props.newAccount ? 'Create Account' : 'Sign In'
  return (
    <div className='inner loginContainer'>
      <form onSubmit={props.onSubmit}>
        { props.error && <div className='error'>Sorry, your credientials could not be verified.<br />Please try again.</div>}
        <h1>
          {title}
        </h1>
        <InputRow label='Username or email address'
          value={props.username} placeholder='email@123.com'
          onChange={props.onUpdateUsername} />
        <InputRow label='Password' type='password'
          value={props.password} placeholder='********'
          onChange={props.onUpdatePassword} />
        <input type='submit' value={buttonText} className='button' />
        <a href='#' className='toggle' onClick={props.onToggleView}>{toggle}</a>
        <div className='google'>
          <div className='or'>or</div>
          <a href='/auth/google'>
            <img src='images/button-google.png' alt='Sign in with Google' className='googleButton' />
          </a>
        </div>
      </form>
      <div className='blurb'>
        <h2>What is this all about?</h2>
        <p>
          Writing down three good things each day&nbsp;
          <a target='_blank' href='https://ppc.sas.upenn.edu/sites/ppc.sas.upenn.edu/files/ppprogressarticle.pdf'>
            can make you happier
          </a>.
          This simple app
          will remind you to record your three
          things every day and store them for
          future reference.
        </p>
      </div>
    </div>
  )
}
