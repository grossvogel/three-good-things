var mongoose = require('mongoose')
var Schema = mongoose.Schema
var plugin = appRequire('model/plugin')

var subscriptionSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  endpoint: {type: String, required: true},
  subscriptionId: {type: String, required: true},
  hour: {type: Number, required: true},
  timezone: {type: String, required: true},
  authKey: {type: String},
  p256dhKey: {type: String}
})
subscriptionSchema.index({user: 1, subscriptionId: 1}, {unique: true})
subscriptionSchema.plugin(plugin.created_at)
subscriptionSchema.plugin(plugin.updated_at)

module.exports = mongoose.model('ReminderSubscription', subscriptionSchema)
