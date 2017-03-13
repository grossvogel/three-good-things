const React = require('react')
const InputRow = require('./input-row')

module.exports = function GoodThingComponent (props) {
  if (props.editing) {
    return (
      <li className={'goodThing editing number' + props.number}>
        <div className='number'>{props.number}</div>
        <form onSubmit={props.onSubmit}>
          <InputRow placeholder='A good thing from today'
            error={props.titleError} value={props.title}
            onChange={props.onUpdateTitle} />
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
      <li className={'goodThing number' + props.number} onClick={props.onClick}>
        <div className='number'>{props.number}</div>
        <div className='title'>{props.title || '-- tbd --'}</div>
        <p className='details'>{props.details}</p>
      </li>
    )
  }
}
