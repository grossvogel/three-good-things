const React = require('react');
const auth = require('./auth');

const Day = React.createClass({
  render: function() {
    var username = auth.loggedIn() ? auth.currentUser().username : '';
    return <DayComponent username={username}/>;
  }
});

function DayComponent(props) {
  return (
    <div className="day">
      {props.username}
    </div>
  );
}

module.exports = Day;
