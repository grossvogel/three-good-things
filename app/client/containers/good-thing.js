const React = require('react')
const api = require('../api')
const dateUtil = require('../../date')
const GoodThingComponent = require('../components/good-thing')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      title: this.props.goodThing.title,
      details: this.props.goodThing.details,
      titleError: null
    }
  },
  handleUpdateTitle: function (e) {
    this.setState({
      title: e.target.value,
      titleError: null
    })
  },
  handleUpdateDetails: function (e) {
    this.setState({
      details: e.target.value
    })
  },
  handleSubmit: function (e) {
    e.preventDefault()
    if (!this.state.title.trim()) {
      this.setState({
        titleError: 'Please enter a title for the good thing!'
      })
      return
    }
    let updateHandler = this.props.onUpdateGoodThing
    saveGoodThing({
      id: this.props.goodThing.id,
      day: this.props.date,
      title: this.state.title,
      details: this.state.details
    }).then(function () {
      updateHandler()
    }).catch(function (err) {
      console.log(err)
      updateHandler()
    })
  },
  handleClick: function () {
    this.props.onClickGoodThing(this.props.date, this.props.number - 1)
  },
  render: function () {
    return <GoodThingComponent
      number={this.props.number}
      title={this.state.title}
      details={this.state.details}
      editing={this.props.editing}
      titleError={this.state.titleError}
      onUpdateTitle={this.handleUpdateTitle}
      onUpdateDetails={this.handleUpdateDetails}
      onClick={this.handleClick}
      onSubmit={this.handleSubmit} />
  }
})

function saveGoodThing (data) {
  data.day = dateUtil.stringify(data.day)
  return api.post('/good-things', data).then(function (result) {
    return result.goodThing
  })
}
