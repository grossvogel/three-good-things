const React = require('react')
const subscriptions = require('../subscriptions')
const dateUtil = require('../../date')
const NotificationSettingsComponent = require('../components/notification-settings')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      subscription: null,
      enabled: true,
      hour: 21
    }
  },
  componentWillMount: function () {
    subscriptions.init()
    .then(this.updateSubscriptionStatus)
    .catch(function (err) {
      console.log(err)
    })
  },
  updateSubscriptionStatus: function (statusInfo) {
    this.setState(statusInfo)
  },
  saveSubscription: function (subscription) {
    this.updateSubscriptionStatus({
      subscription: subscription,
      enabled: true
    })
    if (subscription) {
      subscriptions.saveSubscription(subscription)
    }
  },
  handleSubscribe: function (e) {
    e.preventDefault()
    subscriptions.subscribe(this.state.hour, dateUtil.getTimezone())
    .then(function (subscription) {
      this.updateSubscriptionStatus({
        subscription: subscription,
        enabled: true
      })
    }.bind(this)).catch(function (err) {
      console.log(err)
    })
  },
  handleUpdateHour: function (e) {
    var newHour = parseInt(e.target.value)
    this.setState({ hour: newHour })
    if (this.state.subscription) {
      var subscription = this.state.subscription
      subscription.hour = newHour
      this.saveSubscription(subscription)
    }
  },
  handleDeleteSubscription: function (e) {
    e.preventDefault()
    subscriptions.remove(this.state.subscription.subscriptionId).then(function () {
      this.setState({ subscription: null })
    }.bind(this)).catch(function (err) {
      console.log(err)
    })
  },
  render: function () {
    return <NotificationSettingsComponent
      defaultHour={this.state.hour}
      enabled={this.state.enabled}
      subscription={this.state.subscription}
      onUpdateHour={this.handleUpdateHour}
      onDeleteSubscription={this.handleDeleteSubscription}
      onSubscribe={this.handleSubscribe} />
  }
})

