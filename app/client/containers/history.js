const React = require('react')
const api = require('../api')
const Loading = require('../components/loading')
const HistoryComponent = require('../components/history')
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
      console.log(goodThings)
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

function loadHistory () {
  var call = api.get('/good-things/history')
  return call.then(function (result) {
    return result.goodThings
  }).catch(function (err) {
    console.log(err)
    return []
  })
}
