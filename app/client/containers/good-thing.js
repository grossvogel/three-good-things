const React = require('react')
const api = require('../api')
const imageUtil = require('../image')
const dateUtil = require('../../date')
const GoodThingComponent = require('../components/good-thing')

module.exports = React.createClass({
  getInitialState: function () {
    let image = this.props.goodThing.image
    return {
      title: this.props.goodThing.title,
      details: this.props.goodThing.details,
      image: image ? image.filename : null,
      uploadId: image ? image._id : null,
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
    saveGoodThing({
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
  },
  handleClick: function () {
    this.props.onClickGoodThing(this.props.date, this.props.number - 1)
  },
  handleInitUpload: function (e) {
    let component = this
    uploadFile(e.target).then(function (upload) {
      component.setState({
        uploadId: upload._id,
        image: upload.filename
      }, function () {
        component.handleSubmit()
      })
    })
  },
  handleRemoveImage: function (e) {
    e.preventDefault()
    let image = this.state.image
    this.setState({
      uploadId: null,
      image: null
    })
    deleteUpload(image).catch(function (err) {
      console.log(err)
    })
  },
  render: function () {
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
})

function saveGoodThing (data) {
  data.day = dateUtil.stringify(data.day)
  return api.post('/good-things', data).then(function (result) {
    return result.goodThing
  })
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
