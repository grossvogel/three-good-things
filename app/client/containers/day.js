const React = require('react')
const dateUtil = require('../../date')
const api = require('../api')
const Loading = require('../components/loading')
const DayComponent = require('../components/day')

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
  handleClickGoodThing: function (date, index) {
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
    let editIndex = extractEditIndex(this.props.params.editIndex, this.state.goodThings, today)
    if (this.state.loading) {
      return <Loading />
    }
    return <DayComponent
      today={today}
      date={date}
      editIndex={editIndex}
      onUpdateGoodThing={this.handleUpdateGoodThing}
      onClickGoodThing={this.handleClickGoodThing}
      onUpload={this.handleUpload}
      goodThings={this.state.goodThings} />
  }
})

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
  if (goodThings.length < 3 && today) {
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

function extractEditIndex (initial, goodThings, today) {
  let editIndex = parseInt(initial)
  let goodThingCount = goodThings.length
  switch (editIndex) {
    case 0:
    case 1:
    case 2:
        //  already set
      break
    default:
      editIndex = today && (goodThingCount < 3 || !goodThings[2].id)
        ? goodThingCount - 1
        : null
      break
  }
  return editIndex
}
