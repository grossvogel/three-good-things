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
  handleClickGoodThing: function (date, index) {
    let dest = '/day/' + dateUtil.stringify(date) + '/' + index
    this.props.router.push(dest)
  },
  render: function () {
    if (this.state.loading) {
      return <Loading />
    }
    return <HistoryComponent
      onClickGoodThing={this.handleClickGoodThing}
      goodThings={this.state.goodThings} />
  }
})

function HistoryComponent (props) {
  let lastDay = dateUtil.stringify(dateUtil.today())
  let goodThingsThisDay = 1
  let items = []
  if (hasGoodThingsToday(props.goodThings, lastDay)) {
    items.push(<DateHeader prefix='Today - ' date={dateUtil.today()} key={lastDay} />)
  } else {
    items.push(<EmptyTodayHeader key='today' />)
  }
  props.goodThings.forEach(function (goodThing) {
    let oDay = dateUtil.fromDb(goodThing.day, true)
    let sDay = dateUtil.stringify(oDay)
    if (sDay !== lastDay) {
      let missedDays = getMissedDays(sDay, lastDay)
      if (missedDays > 0) {
        items.push(<MissingDaysNote key={'missed-' + sDay} days={missedDays} />)
      }
      lastDay = sDay
      goodThingsThisDay = 1
      items.push(<DateHeader date={oDay} key={sDay} />)
    }
    items.push(
      <GoodThing number={goodThingsThisDay}
        date={oDay}
        editing={false}
        onClickGoodThing={props.onClickGoodThing}
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
    <li className='dateHeader'>
      <Link to={linkDest}>{props.prefix}{linkText}</Link>
    </li>
  )
}

function EmptyTodayHeader () {
  return (
    <li className='today'>
      No good things yet today?
      <Link to='/'>Record some now!</Link>
    </li>
  )
}

function MissingDaysNote (props) {
  let label = props.days > 1 ? 'days' : 'day'
  return (
    <li className='missedDays'>Missed {props.days} {label}</li>
  )
}

function hasGoodThingsToday (goodThings, today) {
  if (goodThings.length > 0) {
    let firstDate = dateUtil.stringify(dateUtil.fromDb(goodThings[0].day, true))
    return firstDate === today
  }
  return false
}

function getMissedDays (currentDay, lastDay) {
  let missedMS = dateUtil.extract(lastDay).getTime() - dateUtil.extract(currentDay).getTime()
  let dayDiff = Math.round(missedMS / (1000 * 60 * 60 * 24))
  return dayDiff - 1
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