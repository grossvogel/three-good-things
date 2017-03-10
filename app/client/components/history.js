const React = require('react')
const Router = require('react-router')
const Link = Router.Link
const api = require('../api')
const Loading = require('./loading')
const GoodThing = require('./good-thing')
const dateUtil = require('../../date')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      goodThings: []
    }
  },
  componentWillMount: function () {
    loadHistory().then(function (goodThings) {
      this.setState({
        loading: false,
        goodThings: goodThings
      })
    }.bind(this))
  },
  handleEditGoodThing: function (date, index) {
    let dest = '/day/' + dateUtil.stringify(date) + '/' + index
    this.props.router.push(dest)
  },
  render: function () {
    if (this.state.loading) {
      return <Loading />
    }
    return <HistoryComponent
      onEditGoodThing={this.handleEditGoodThing}
      goodThings={this.state.goodThings} />
  }
})

function HistoryComponent (props) {
  //  @TODO: Always show _something_ for today
  //  @TODO: Show # of missed days between?
  let lastDay = dateUtil.stringify(dateUtil.today())
  let goodThingsThisDay = 0
  let items = []
  appendTodayHeader(items, props.goodThings, lastDay)
  props.goodThings.forEach(function (goodThing) {
    let oDay = dateUtil.fromDb(goodThing.day, true)
    let sDay = dateUtil.stringify(oDay)
    if (sDay !== lastDay) {
      appendMissedDaysHeader(items, sDay, lastDay)
      lastDay = sDay
      goodThingsThisDay = 1
      items.push(<DateHeader date={oDay} key={sDay} />)
    }
    items.push(
      <GoodThing number={goodThingsThisDay}
        date={oDay}
        editing={false}
        onEditGoodThing={props.onEditGoodThing}
        goodThing={goodThing}
        key={goodThing._id} />
    )
    goodThingsThisDay++
  })

  return (
    <ul className='goodThingList history inner'>
      {items}
    </ul>
  )
}

function DateHeader (props) {
  let linkDest = '/day/' + dateUtil.stringify(props.date)
  let linkText = dateUtil.niceFormat(props.date)
  return (
    <li className='dateLink'>
      <Link to={linkDest}>{linkText}</Link>
    </li>
  )
}

function Today () {
  return (
    <li className='today'>
      No good things yet today?
      <Link to='/'>Record some now!</Link>
    </li>
  )
}

function MissingDays (props) {
  let label = props.days > 1 ? 'days' : 'day'
  return (
    <li className='missedDays'>Missed {props.days} {label}</li>
  )
}

function appendTodayHeader (items, goodThings, lastDay) {
  if (goodThings.length === 0 ||
    dateUtil.stringify(dateUtil.fromDb(goodThings[0].day)) !== lastDay) {
    items.push(<Today key='today' />)
  }
}

function appendMissedDaysHeader (items, currentDay, lastDay) {
  let missedMS = dateUtil.extract(lastDay).getTime() - dateUtil.extract(currentDay).getTime()
  let dayDiff = Math.round(missedMS / (1000 * 60 * 60 * 24))
  if (dayDiff > 1) {
    items.push(<MissingDays key={'missed-' + currentDay} days={dayDiff - 1} />)
  }
}

function loadHistory () {
  var call = api.get('/good-things/history')
  return call.then(function (result) {
    return result.goodThings
  }).catch(function (err) {
    console.log(err)
    return []
  })
}
