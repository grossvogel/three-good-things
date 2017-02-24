const React = require('react');

module.exports = function Loading(_props) {
  return (
    <div className="loader">
      <img src="/images/loader.gif" alt="Loading...good things come to those who wait"/>;
    </div>
  );
};

