const React = require('react')

module.exports = function InputRow (props) {
  return (
    <div className='input-row'>
      {props.label && <label>{props.label}</label>}
      <input type={props.type || 'text'} value={props.value}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        onChange={props.onChange} />
    </div>
  )
}

