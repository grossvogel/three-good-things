const React = require('react')
const api = require('../api')
const dateUtil = require('../../date')
const InputRow = require('./input-row')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      title: this.props.goodThing.title,
      details: this.props.goodThing.details
    }
  },
  handleUpdateTitle: function (e) {
    this.setState({
      title: e.target.value
    })
  },
  handleUpdateDetails: function (e) {
    this.setState({
      details: e.target.value
    })
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var updateHandler = this.props.onUpdateGoodThing
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
  handleEdit: function () {
    this.props.onEditGoodThing(this.props.date, this.props.number - 1)
  },
  render: function () {
    return <GoodThingComponent
      number={this.props.number}
      title={this.state.title}
      details={this.state.details}
      editing={this.props.editing}
      onUpdateTitle={this.handleUpdateTitle}
      onUpdateDetails={this.handleUpdateDetails}
      onEdit={this.handleEdit}
      onSubmit={this.handleSubmit} />
  }
})

function GoodThingComponent (props) {
  if (props.editing) {
    return (
      <li className={'goodThing editing number' + props.number}>
        <div className='number'>{props.number}</div>
        <form onSubmit={props.onSubmit}>
          <InputRow placeholder='A good thing from today'
            value={props.title} onChange={props.onUpdateTitle} />
          <div className='input-row'>
            <textarea placeholder='More details...' value={props.details}
              onChange={props.onUpdateDetails} />
          </div>
          <input type='submit' className='button' value='Save' />
        </form>
      </li>
    )
  } else {
    return (
      <li className={'goodThing number' + props.number} onClick={props.onEdit}>
        <div className='number'>{props.number}</div>
        <div className='title'>{props.title || '-- tbd --'}</div>
        <p className='details'>{props.details}</p>
      </li>
    )
  }
}

function saveGoodThing (data) {
  data.day = dateUtil.stringify(data.day)
  return api.post('/good-things', data).then(function (result) {
    return result.goodThing
  })
}
