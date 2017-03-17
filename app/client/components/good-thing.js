const React = require('react')
const Link = require('react-router').Link
const InputRow = require('./input-row')

module.exports = function GoodThingComponent (props) {
  if (props.editing) {
    return (
      <li className={'goodThing editing number' + props.number}>
        <div className='number'>{props.number}</div>
        <form onSubmit={props.onSubmit}>
          <GoodThingImage filename={props.image} onRemoveImage={props.onRemoveImage} />
          <InputRow placeholder='A good thing from today'
            error={props.titleError} value={props.title}
            onChange={props.onUpdateTitle} />
          <div className='input-row'>
            <textarea placeholder='More details...' value={props.details}
              onChange={props.onUpdateDetails} />
            <img src='/images/icon-photo.png' alt='upload a photo'
              className='photoButton' onClick={input => this.fileInput.click()} />
          </div>
          <input type='submit' className='button' value='Save' />
          <input type='file' className='fileInput'
            capture='camera' accept='image/png, image/jpeg'
            ref={input => { this.fileInput = input; true }}
            onChange={props.onInitUpload} />
        </form>
      </li>
    )
  } else {
    return (
      <li className={'goodThing number' + props.number} onClick={props.onClick}>
        <GoodThingImage filename={props.image} />
        <div className='number'>{props.number}</div>
        <div className='title'>{props.title}&nbsp;</div>
        <p className='details'>{props.details}</p>
      </li>
    )
  }
}

function GoodThingImage (props) {
  return (props.filename && (
    <div className='goodThingImage'>
      <Link to={'/image/' + props.filename} onClick={(e) => e.stopPropagation()}>
        <img src={'/uploads/' + props.filename} alt='' />
      </Link>
      {props.onRemoveImage && <a href='#' className='remove' onClick={props.onRemoveImage}>Remove</a>}
    </div>
  )) || null
}
