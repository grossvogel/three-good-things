const React = require('react');
const Header = require('./header');
const Footer = require('./footer');

module.exports = function App(props) {
  return (
    <div className="app">
      <Header/>
      <section className="inner">
        {props.children}
      </section>
      <Footer/>
    </div>
  );
};

