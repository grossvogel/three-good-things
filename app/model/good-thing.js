var mongoose = require('mongoose')
var Schema = mongoose.Schema
var plugin = appRequire('model/plugin')

var goodThingSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  day: {type: Date, required: true},
  title: {type: String},
  details: String,
  image: {type: Schema.Types.ObjectId, ref: 'Upload'}
})
goodThingSchema.index({user: 1, day: -1})
goodThingSchema.plugin(plugin.created_at)
goodThingSchema.plugin(plugin.updated_at)
goodThingSchema.pre('validate', function (next) {
  if (!this.title && !this.image) {
    next(Error('Either a title or image is required'))
  } else {
    next()
  }
})

module.exports = mongoose.model('GoodThing', goodThingSchema)
