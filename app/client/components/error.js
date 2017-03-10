const React = require('react')

module.exports = function Error (props) {
  let classes = ['error']
  if (Array.isArray(props.classes)) {
    classes = classes.concat(props.classes)
  }
  return (props.error && (
    <div className={classes.join(' ')}>
      {props.error}
    </div>
  )) || null
}
