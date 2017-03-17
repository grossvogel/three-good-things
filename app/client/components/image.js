const React = require('react')

module.exports = function Image (props) {
  return (
    <div className='imageView inner'>
      <img src={'/uploads/' + props.params.filename} alt='' onClick={props.router.goBack} />
      <div>
        <button onClick={props.router.goBack}>Done</button>
      </div>
    </div>
  )
}
