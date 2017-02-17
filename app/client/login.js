const React = require('react');
const auth = require('./auth');

const Login = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      loginInProgress: false,
      newAccount: true,
      error: false
    };
  },
  componentWillMount: function() {
    var component = this;
    if (auth.loggedIn()) {
      component.completeLogin();
    } else {
      auth.checkSession().then(function(user) {
        if (user) {
          auth.updateUser(user);
          component.completeLogin();
        }
      }).catch(function(err) {
        console.log(err);
      });
    }
  },
  completeLogin: function() {
    var dest = auth.nextPathname() || '/';
    this.props.router.replace(dest);
  },
  handleUpdateUsername(e) {
    this.setState({
      username: e.target.value
    });
  },
  handleUpdatePassword(e) {
    this.setState({
      password: e.target.value
    });
  },
  handleToggleView(e) {
    e.preventDefault();
    this.setState({
      newAccount: !this.state.newAccount
    });
  },
  handleSubmission(e) {
    e.preventDefault();
    this.setState({
      loginInProgress: true
    });
    var component = this;
    var submit = auth.signupOrLogin(this.state.username, this.state.password, this.state.newAccount);
    submit.then(function(user) {
      if(user) {
        auth.updateUser(user);
        component.completeLogin();
      } else {
        component.setState({
          error: true,
          loginInProgress: false
        });
      }
    }).catch(function(err) {
      console.log(err);
      component.setState({
        error: true,
        loginInProgress: false
      });
    });
  },
  render: function() {
    return (
      <LoginComponent
        username={this.state.username}
        password={this.state.password}
        newAccount={this.state.newAccount}
        error={this.state.error}
        loginInProgress={this.state.loginInProgress}
        onSubmit={this.handleSubmission}
        onToggleView={this.handleToggleView}
        onUpdateUsername={this.handleUpdateUsername}
        onUpdatePassword={this.handleUpdatePassword}/>
    );
  }
});

function LoginComponent(props) {
  var inner;
  var title = props.newAccount ? 'Create your account to begin' : 'Sign in to your account';
  var toggle = props.newAccount ? '(sign in)' : '(create an account)';
  var buttonText = props.newAccount ? 'Create Account' : 'Sign In';
  if(props.loginInProgress) {
    inner = <div className="loading">Please wait while we initiate your login...</div>;
  } else {
    inner = (
      <form onSubmit={props.onSubmit}>
        { props.error && <div className="error">Sorry, your credientials could not be verified.<br/>Please try again.</div>}
        <h1>
          {title}
        </h1>
        <InputRow label="Username or email address"
          value={props.username} placeholder="email@123.com"
          onChange={props.onUpdateUsername}/>
        <InputRow label="Password" type="password"
          value={props.password} placeholder="********"
          onChange={props.onUpdatePassword}/>
        <input type="submit" value={buttonText} className="button"/>
        <a href="#" className="toggle" onClick={props.onToggleView}>{toggle}</a>
        <div className="google">
          <a href="/auth/google">Sign in with Google</a>
        </div>
      </form>
    );
  }
  return (
    <div className="loginContainer">
      {inner}
    </div>
  );
}

function InputRow(props) {
  var type = props.type ? props.type : 'text';
  return (
    <div className="input-row">
      <label>{props.label}</label>
      <input type={type} value={props.value} placeholder={props.placehoder} onChange={props.onChange}/>
    </div>
  );
}

module.exports = Login;
