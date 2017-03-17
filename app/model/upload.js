var mongoose = require('mongoose')
var Schema = mongoose.Schema
var plugin = appRequire('model/plugin')

var uploadSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', index: true, required: true},
  originalFilename: {type: String, required: true},
  contentType: {type: String, required: true},
  filename: {type: String}
})
uploadSchema.plugin(plugin.created_at)
uploadSchema.plugin(plugin.updated_at)

module.exports = mongoose.model('Upload', uploadSchema)
