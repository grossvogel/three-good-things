const React = require('react')
const Router = require('react-router')
const Link = Router.Link

module.exports = function Header (props) {
  return (
    <header>
      <div className='inner'>
        <img className='logo' src='/images/logo.png' alt='three-good-things' />
        { props.router.isActive('/login') || <SettingsLink /> }
      </div>
    </header>
  )
}

function SettingsLink (props) {
  return (
    <Link to='/settings'>
      <img className='menu' src='/images/hamburger.png' alt='menu' />
    </Link>
  )
}
