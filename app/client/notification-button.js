const React = require('react');
const Notification = require('./notification');
const api = require('./api');

var NotificationButton = module.exports = React.createClass({
  getInitialState: function() {
    return {
      enabled: false
    };
  },
  componentWillMount: function() {
    var component = this;
    Notification.init()
    .then(this.updateSubscriptionInfo)
    .catch(function(err) {
      console.log(err);
    });
  },
  updateSubscriptionInfo: function(subscription) {
    this.setState({
      enabled: !subscription
    });
    if(subscription) {
      Notification.saveSubscription(subscription);
    }
  },
  handleSubscribe: function() {
    Notification.subscribe()
    .then(this.updateSubscriptionInfo)
    .catch(function (err) {
      console.log(err);
    });
  },
  render: function() {
    return <NotificationButtonComponent
      enabled={this.state.enabled}
      subscribed={this.state.subscribed}
      onSubscribe={this.handleSubscribe}/>;
  }
});

function NotificationButtonComponent(props) {
  return props.enabled && (
    <footer>
      <div className="inner">
        Never forget your good things
        <button type="button" onClick={props.onSubscribe}>
          Enable Reminders
        </button>
      </div>
    </footer>
  );
}
