const React = require('react')
const Error = require('./error')

module.exports = function InputRow (props) {
  return (
    <div className='input-row'>
      {props.label && <label>{props.label}</label>}
      <input type={props.type || 'text'} value={props.value}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        onChange={props.onChange} />
      <Error error={props.error} />
    </div>
  )
}

