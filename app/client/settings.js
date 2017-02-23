const React = require('react');
const Router = require('react-router');
const Link = Router.Link;
const NotificationSettings = require('./notification-settings.js');

const Settings = function(props) {
    return (
      <div className="settings inner">
        <NotificationSettings/>
        <div className="settingsDone">
          <Link className="button" to='/'>Done</Link>
        </div>
      </div>
    );
};

module.exports = Settings;
