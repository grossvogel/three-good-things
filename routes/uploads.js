const express = require('express')
const router = express.Router()
const uploads = appRequire('uploads')
const auth = appRequire('auth')
const config = require('../config')
const multer = require('multer')

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 7000000, files: 1}
}).single('upload')

router.use(auth.requireUser)
router.post('/', uploader, uploads.upload(config))
router.get('/:filename', uploads.get(config))
router.delete('/:filename', uploads.remove(config))

module.exports = router
