const React = require('react');
const Notification = require('./notification');
const dateUtil = require('../date');
const api = require('./api');

var NotificationSettings = module.exports = React.createClass({
  getInitialState: function() {
    return {
      subscription: null,
      enabled: true,
      hour: 21
    };
  },
  componentWillMount: function() {
    var component = this;
    Notification.init()
    .then(this.updateSubscriptionStatus)
    .catch(function(err) {
      console.log(err);
    });
  },
  updateSubscriptionStatus: function(statusInfo) {
    this.setState(statusInfo);
  },
  saveSubscription: function(subscription) {
    this.updateSubscriptionStatus({
      subscription: subscription,
      enabled: true
    });
    if(subscription) {
      Notification.saveSubscription(subscription);
    }
  },
  handleSubscribe: function(e) {
    e.preventDefault();
    var component = this;
    Notification.subscribe(this.state.hour, dateUtil.getTimezone())
    .then(function(subscription) {
      component.updateSubscriptionStatus({
        subscription: subscription,
        enabled: true
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  handleUpdateHour: function(e) {
    var newHour = parseInt(e.target.value);
    this.setState({ hour: newHour });
    if (this.state.subscription) {
      var subscription = this.state.subscription;
      subscription.hour = newHour;
      this.saveSubscription(subscription);
    }
  },
  handleDeleteSubscription: function(e) {
    e.preventDefault();
    var component = this;
    Notification.remove(this.state.subscription.subscriptionId).then(function() {
      component.setState({ subscription: null });
    }).catch(function(err) {
      console.log(err);
    });
  },
  render: function() {
    return <NotificationSettingsComponent
      defaultHour={this.state.hour}
      enabled={this.state.enabled}
      subscription={this.state.subscription}
      onUpdateHour={this.handleUpdateHour}
      onDeleteSubscription={this.handleDeleteSubscription}
      onSubscribe={this.handleSubscribe}/>;
  }
});

function NotificationSettingsComponent(props) {
  return (
    <div className="settingsSection">
      <h3>Notifications</h3>
      <div className="setting">
        { props.enabled || <DisabledView/> }
        { props.enabled && props.subscription && <SubscribedView {...props}/> }
        { props.enabled && !props.subscription && <EnabledView {...props}/> }
      </div>
    </div>
  );
}

function DisabledView(props) {
  return (
    <p className="deemphasized">
      Sorry, notifications are not currently available for this device.
    </p>
  );
}

function EnabledView(props) {
  return (
    <div>
      Receive a daily reminder on this device to record your good things?

      <p className="timeControls">
        <TimeChooser current={props.defaultHour} onChange={props.onUpdateHour}/>
        <span className="timezone">{dateUtil.getTimezone()} time</span>
      </p>

      <a className="button small" onClick={props.onSubscribe} href="#">Enable Reminders</a> 
    </div>
  );
}

function SubscribedView(props) {
  return (
    <div>
      You are currently receiving daily reminders on this device at
      <p className="timeControls">
        <TimeChooser current={props.subscription.hour} onChange={props.onUpdateHour}/>
        <span className="timezone">{props.subscription.timezone} time</span>
      </p>
      <a className="removeSubscription" href="#" onClick={props.onDeleteSubscription}>Unsubscribe</a>
    </div>
  );
}

function TimeChooser(props) {
  var hours = [];
  for (var i = 0; i < 24; i++) {
    hours.push(dateUtil.formatHour(i));
  }
  return (
    <select onChange={props.onChange} defaultValue={props.current}>
      { hours.map((formatted, raw) => (
        <option key={raw} value={raw}>{formatted}</option>
      ))}
    </select>
  );
}

