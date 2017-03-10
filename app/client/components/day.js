const React = require('react')
const Router = require('react-router')
const dateUtil = require('../../date')
const api = require('../api')
const GoodThing = require('./good-thing')
const Loading = require('./loading')
const Link = Router.Link

module.exports = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      goodThings: []
    }
  },
  componentWillMount: function () {
    this.loadData(this.props.params.date)
  },
  handleUpdateGoodThing: function () {
    this.loadData(this.props.params.date)
  },
  handleEditGoodThing: function (date, index) {
    let dest = '/day/' + dateUtil.stringify(date) + '/' + index
    this.props.router.replace(dest)
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      loading: true
    }, function () {
      this.loadData(nextProps.params.date)
    })
  },
  loadData: function (date) {
    loadGoodThings(date).then(function (goodThings) {
      this.setState({
        loading: false,
        goodThings: goodThings
      })
    }.bind(this))
  },
  render: function () {
    let [ date, today ] = extractDate(this.props.params.date)
    let editIndex = extractEditIndex(this.props.params.editIndex, this.state.goodThings)
    if (this.state.loading) {
      return <Loading />
    }
    return <DayComponent
      today={today}
      date={date}
      editIndex={editIndex}
      onUpdateGoodThing={this.handleUpdateGoodThing}
      onEditGoodThing={this.handleEditGoodThing}
      goodThings={this.state.goodThings} />
  }
})

function DayComponent (props) {
  var nextDay = dateUtil.stringify(dateUtil.nextDay(props.date))
  var prevDay = dateUtil.stringify(dateUtil.previousDay(props.date))
  return (
    <div className='day'>
      <div className='nav'>
        <div className='inner'>
          <Link to={'/day/' + prevDay} className='prev'><span>Previous Day</span></Link>
          {(props.today && 'Today') || dateUtil.niceFormat(props.date)}
          { props.today || <Link to={'/day/' + nextDay} className='next'><span>Next Day</span></Link> }
        </div>
      </div>
      <ul className='inner goodThingList'>
        {props.goodThings.map((goodThing, index) => (
          <GoodThing number={index + 1}
            date={props.date}
            editing={index === props.editIndex}
            onUpdateGoodThing={props.onUpdateGoodThing}
            onEditGoodThing={props.onEditGoodThing}
            goodThing={goodThing}
            key={goodThing.id || goodThing.key} />
        ))}
      </ul>
      <div className='historyLink inner'>
        <Link to='/history'>View History</Link>
      </div>
    </div>
  )
}

function extractDate (initial) {
  var today = dateUtil.today()
  var date = dateUtil.extract(initial, true) || today
  return [ date, (date.valueOf() === today.valueOf()) ]
}

function loadGoodThings (dateParam) {
  let [ date, today ] = extractDate(dateParam)
  var call = api.get('/good-things/' + dateUtil.stringify(date))
  return call.then(function (result) {
    return result.goodThings
  }).catch(function (err) {
    console.log(err)
    return []
  }).then(function (goodThings) {
    return finalizeThings(goodThings, today)
  })
}

function finalizeThings (goodThings, today) {
  goodThings.map(function (goodThing, index) {
    goodThing.id = goodThing._id
  })
  if (goodThings.length < 3) {
    var newThing = {
      id: null,
      title: '',
      details: '',
      key: goodThings.length + 1
    }
    goodThings.push(newThing)
  }
  return goodThings
}

function extractEditIndex (initial, goodThings) {
  let editIndex = parseInt(initial)
  let goodThingCount = goodThings.length
  switch (editIndex) {
    case 0:
    case 1:
    case 2:
        //  already set
      break
    default:
      editIndex = (goodThingCount < 3 || !goodThings[2].id)
        ? goodThingCount - 1
        : null
      break
  }
  return editIndex
}
