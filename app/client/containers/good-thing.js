import React from 'react'
import { connect } from 'react-redux'
import api from '../api'
import imageUtil from '../image'
import dateUtil from '../../date'
import GoodThingComponent from '../components/good-thing'
import { saveGoodThing } from '../actions/good-thing'

class GoodThing extends React.Component {
  constructor (props) {
    super(props)
    let image = props.goodThing.image
    this.state = {
      title: props.goodThing.title,
      details: props.goodThing.details,
      image: image ? image.filename : null,
      uploadId: image ? image._id : null,
      titleError: null
    }
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this)
    this.handleUpdateDetails = this.handleUpdateDetails.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleInitUpload = this.handleInitUpload.bind(this)
    this.handleRemoveImage = this.handleRemoveImage.bind(this)
  }

  handleUpdateTitle (e) {
    this.setState({
      title: e.target.value,
      titleError: null
    })
  }

  handleUpdateDetails (e) {
    this.setState({
      details: e.target.value
    })
  }

  handleSubmit (e) {
    if (e) {
      e.preventDefault()
    }
    if (!this.state.title.trim() && !this.state.uploadId) {
      this.setState({
        titleError: 'Please enter a title for the good thing!'
      })
      return
    }

    let updateHandler = this.props.onUpdateGoodThing
    this.props.saveGoodThing({
      id: this.props.goodThing.id,
      day: this.props.date,
      title: this.state.title,
      details: this.state.details,
      uploadId: this.state.uploadId
    }).then(function () {
      updateHandler()
    }).catch(function (err) {
      console.log(err)
      updateHandler()
    })
  }

  handleClick () {
    this.props.onClickGoodThing(this.props.date, this.props.number - 1)
  }

  handleInitUpload (e) {
    let component = this
    uploadFile(e.target).then(function (upload) {
      component.setState({
        uploadId: upload._id,
        image: upload.filename
      }, function () {
        component.handleSubmit()
      })
    })
  }

  handleRemoveImage (e) {
    e.preventDefault()
    let image = this.state.image
    this.setState({
      uploadId: null,
      image: null
    })
    deleteUpload(image).catch(function (err) {
      console.log(err)
    })
  }

  render () {
    return <GoodThingComponent
      number={this.props.number}
      title={this.state.title}
      details={this.state.details}
      image={this.state.image}
      editing={this.props.editing}
      titleError={this.state.titleError}
      onUpdateTitle={this.handleUpdateTitle}
      onUpdateDetails={this.handleUpdateDetails}
      onClick={this.handleClick}
      onInitUpload={this.handleInitUpload}
      onRemoveImage={this.handleRemoveImage}
      onSubmit={this.handleSubmit} />
  }
}

function uploadFile (fileInput) {
  let maxWidth = 500
  let file = fileInput.files[0]
  let filename = file.name.replace(/\.jpe?g$/, '.png')
  return imageUtil.fileToImage(file).then(function (img) {
    let factor = Math.min(1, maxWidth / img.width)
    return imageUtil.imageToCanvas(img, factor)
  }).then(function (canvas) {
    return imageUtil.canvasToBlob(canvas, 'image/png')
  }).then(function (blob) {
    return api.upload('/uploads', blob, filename, 'upload')
  }).then(function (response) {
    if (response.err) {
      return Promise.reject(new Error('Error uploading file'))
    } else {
      return response.upload
    }
  })
}

function deleteUpload (upload) {
  return api.request('/uploads/' + upload, 'delete')
}

const mapStateToProps = function (state) {
  return {}
}
const mapDispatchToProps = function (dispatch) {
  return {
    saveGoodThing: (data) => {
      return dispatch(saveGoodThing(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodThing)
