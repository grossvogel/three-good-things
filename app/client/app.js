const React = require('react');
const Header = require('./header');

module.exports = function App(props) {
  return (
    <div className="app">
      <Header/>
      <section className="main">
        {props.children}
      </section>
    </div>
  );
};

