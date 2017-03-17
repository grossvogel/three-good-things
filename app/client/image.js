module.exports = {
  fileToImage,
  imageToCanvas,
  canvasToBlob
}

function imageToCanvas (img, scaleFactor = 1) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = img.width * scaleFactor
  canvas.height = img.height * scaleFactor
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}

function fileToImage (file) {
  return new Promise(function (resolve) {
    let img = new window.Image()
    img.onload = function () {
      resolve(this)
    }

    let reader = new window.FileReader()
    reader.addEventListener('load', function () {
      img.src = reader.result
    })
    reader.readAsDataURL(file)
  })
}

function canvasToBlob (canvas, mimeType) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob)
    })
  }, mimeType)
}
