const React = require('react')
const InputRow = require('./input-row')
const Error = require('./error')

module.exports = function LoginComponent (props) {
  let title = props.newAccount ? 'Create your account to begin' : 'Sign in to your account'
  let toggle = props.newAccount ? '(sign in)' : '(create an account)'
  let buttonText = props.newAccount ? 'Create Account' : 'Sign In'
  return (
    <div className='inner loginContainer'>
      <form onSubmit={props.onSubmit}>
        <Error error={props.error} classes={['top']} />
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
