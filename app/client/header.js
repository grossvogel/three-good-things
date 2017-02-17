const React = require('react');

module.exports = function Header(_props) {
  return (
    <header>
      <div className="inner">
        <img className="logo" src="/images/logo.png" alt="three-good-things"/>
        <img className="menu" src="/images/hamburger.png" alt="menu"/>
      </div>
    </header>
  );
};

