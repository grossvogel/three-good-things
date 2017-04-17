import React from 'react'
import { connect } from 'react-redux'
import dateUtil from '../../date'
import Loading from '../components/loading'
import DayComponent from '../components/day'
import * as actions from '../actions/day'

class Day extends React.Component {
  componentWillMount () {
    this.props.loadData(this.props.params.date)
  }

  handleUpdateGoodThing () {
    this.props.loadData(this.props.params.date)
  }

  handleClickGoodThing (date, index) {
    let dest = '/day/' + dateUtil.stringify(date) + '/' + index
    this.props.router.replace(dest)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.date !== this.props.params.date) {
      this.props.loadData(nextProps.params.date)
    }
  }

  render () {
    let [ date, today ] = extractDate(this.props.params.date)
    let editIndex = extractEditIndex(this.props.params.editIndex, this.props.goodThings, today)
    if (this.props.loading) {
      return <Loading />
    }
    return <DayComponent
      today={today}
      date={date}
      editIndex={editIndex}
      onUpdateGoodThing={this.handleUpdateGoodThing.bind(this)}
      onClickGoodThing={this.handleClickGoodThing.bind(this)}
      goodThings={this.props.goodThings} />
  }
}

function extractDate (initial) {
  var today = dateUtil.today()
  var date = dateUtil.extract(initial, true) || today
  return [ date, (date.valueOf() === today.valueOf()) ]
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
  let goodThingCount = goodThings.length || goodThings.size
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

const mapStateToProps = function (state, ownProps) {
  let dateParam = ownProps.params.date
  let [date, today] = extractDate(dateParam)
  let day = state.getIn(['day', dateUtil.stringify(date)]) || null
  let things = day ? day.get('goodThings') : []
  let goodThings = finalizeThings(
    things.map(id => state.get('goodThings').get(id)),
    today)
  return {
    date,
    today,
    goodThings,
    loading: day ? day.get('loading') : true
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    loadData: function (dateParam) {
      let [date] = extractDate(dateParam)
      dispatch(actions.loadDay(date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Day)
