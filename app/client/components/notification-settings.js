const React = require('react')
const dateUtil = require('../../date')

module.exports = function NotificationSettingsComponent (props) {
  return (
    <div className='settingsSection'>
      <h3>Notifications</h3>
      <div className='setting'>
        { props.enabled || <DisabledView /> }
        { props.enabled && props.subscription && <SubscribedView {...props} /> }
        { props.enabled && !props.subscription && <EnabledView {...props} /> }
      </div>
    </div>
  )
}

function DisabledView (props) {
  return (
    <p className='deemphasized'>
      Sorry, notifications are not currently available for this device.
    </p>
  )
}

function EnabledView (props) {
  return (
    <div>
      Receive a daily reminder on this device to record your good things?

      <p className='timeControls'>
        <TimeChooser current={props.defaultHour} onChange={props.onUpdateHour} />
        <span className='timezone'>{dateUtil.getTimezone()} time</span>
      </p>

      <a className='button small' onClick={props.onSubscribe} href='#'>Enable Reminders</a>
    </div>
  )
}

function SubscribedView (props) {
  return (
    <div>
      You are currently receiving daily reminders on this device at
      <p className='timeControls'>
        <TimeChooser current={props.subscription.hour} onChange={props.onUpdateHour} />
        <span className='timezone'>{props.subscription.timezone} time</span>
      </p>
      <a className='removeSubscription' href='#' onClick={props.onDeleteSubscription}>Unsubscribe</a>
    </div>
  )
}

function TimeChooser (props) {
  var hours = []
  for (var i = 0; i < 24; i++) {
    hours.push(dateUtil.formatHour(i))
  }
  return (
    <select onChange={props.onChange} defaultValue={props.current}>
      { hours.map((formatted, raw) => (
        <option key={raw} value={raw}>{formatted}</option>
      ))}
    </select>
  )
}

