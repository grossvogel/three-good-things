const AWS = require('aws-sdk')
const Upload = appRequire('model/upload')

module.exports = {
  upload: fileUpload,
  get: fileProxy,
  remove: fileRemove,

  //  private functions exported for testing
  _getUpload: getUpload,
  _createUpload: createUpload
}

//  route handlers

function fileUpload (config) {
  let {client, bucket} = getClient(config)
  return function (req, res, _next) {
    if (!req.file) {
      res.status(400).json({
        err: 'No upload found', upload: null
      })
    }

    createUpload(req.user, req.file.originalname).then(function (upload) {
      return uploadFile(req.file.buffer, upload, client, bucket)
    }).then(function (upload) {
      res.status(201).json({
        err: null, upload: upload
      })
    }).catch(function (err) {
      res.status(500).json({
        err: err.message, upload: null
      })
    })
  }
}

function fileProxy (config) {
  let {client, bucket} = getClient(config)

  return function (req, res, next) {
    let {base: id} = splitFilename(req.params.filename)
    getUpload(req.user, id).then(function (upload) {
      streamFile(client, bucket, upload, res, next)
    }).catch(function (s3Err) {
      console.log('Error in S3 Proxy', s3Err)
      let err = new Error('Not Found')
      err.status = 404
      next(err)
    })
  }
}

function fileRemove (config) {
  let {client, bucket} = getClient(config)

  return function (req, res, next) {
    let filename = req.params.filename
    let {base: id} = splitFilename(filename)
    deleteS3File(client, bucket, filename).then(function () {
      return deleteUpload(req.user, id)
    }).then(function () {
      res.status(202).json({err: null})
    }).catch(function (err) {
      res.status(500).json({err: err.message})
    })
  }
}

//  other exports

function getUpload (user, uploadId) {
  return Upload.findOne({
    user: user,
    _id: uploadId
  }).exec().then(function (upload) {
    return upload || Promise.reject(new Error('File Not Found'))
  })
}

function createUpload (user, originalFilename) {
  console.log(originalFilename, splitFilename(originalFilename))
  let {extension} = splitFilename(originalFilename)
  let contentType = getContentType(extension)
  if (!contentType) {
    return Promise.reject(new Error('Invalid file extension'))
  }

  let upload = new Upload({user, originalFilename, contentType})
  return upload.save().then(function (saved) {
    saved.filename = saved._id + '.' + extension
    return saved.save()
  })
}

function deleteUpload (user, id) {
  return Upload.findOneAndRemove({user: user, _id: id})
}

//  private helpers

function getClient (config) {
  let creds = new AWS.Credentials({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey
  })
  let client = new AWS.S3({
    region: config.aws.defaultRegion,
    credentials: creds
  })
  let bucket = config.aws.S3Bucket
  return {client, bucket}
}

function uploadFile (fileBuffer, upload, client, bucket) {
  return new Promise(function (resolve, reject) {
    let params = {
      Bucket: bucket,
      Key: upload.filename,
      ContentType: upload.contentType,
      ACL: 'private',
      Body: fileBuffer
    }
    client.putObject(params, function (err, data) {
      if (err) {
        reject(new Error('Error uploading file to S3'))
      } else {
        resolve(upload)
      }
    })
  })
}

function streamFile (client, bucket, upload, res, next) {
  let stream = client.getObject({
    Bucket: bucket,
    Key: upload.filename
  }).createReadStream()
  stream.on('error', function (s3Err) {
    console.log('Error streaming file from S3', s3Err)
    res.removeHeader('Content-Type')
    let err = new Error('Not Found')
    err.status = 404
    next(err)
  })
  stream.on('end', function () {
    res.end()
  })
  res.set('Content-Type', upload.contentType)
  res.set('Cache-Control', 'private, max-age=31536000')
  stream.pipe(res)
}

function deleteS3File (client, bucket, filename) {
  return new Promise(function (resolve, reject) {
    client.deleteObject({
      Bucket: bucket,
      Key: filename
    }, function (err, data) {
      if (err) {
        console.log('S3 delete failed', err)
        reject(new Error('S3 delete failed'))
      } else {
        resolve()
      }
    })
  })
}

function splitFilename (filename) {
  let base = filename
  let extension = null
  let pieces = filename.split('.')
  if (pieces.length > 1) {
    extension = pieces.pop()
    base = pieces.join('.')
  }
  return {base, extension}
}

function getContentType (extension) {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return null
  }
}
