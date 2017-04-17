import React from 'react'
import { connect } from 'react-redux'
import Loading from '../components/loading'
import HistoryComponent from '../components/history'
import dateUtil from '../../date'
import * as actions from '../actions/history'

class History extends React.Component {
  componentWillMount () {
    this.props.beginLoad()
  }

  handleClickGoodThing (date, index) {
    let dest = '/day/' + dateUtil.stringify(date) + '/' + index
    this.props.router.push(dest)
  }

  render () {
    if (this.props.loading) {
      return <Loading />
    }
    return <HistoryComponent
      onClickGoodThing={this.handleClickGoodThing.bind(this)}
      goodThings={this.props.goodThings} />
  }
}

const mapStateToProps = function (state) {
  let goodThings = state.get('history').get('goodThings')
    .map(id => state.get('goodThings').get(id))
    .filter(thing => !!thing)
  return {
    loading: state.get('history').get('loading'),
    goodThings: goodThings
  }
}

const mapDispatchToProps = function (dispatch, props) {
  return {
    beginLoad: function () {
      dispatch(actions.loadHistory())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
