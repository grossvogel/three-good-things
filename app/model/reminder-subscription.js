var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plugin = appRequire('model/plugin');

var subscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  endpoint: { type: String, required: true },
  subscriptionId: { type: String },
  hour: { type: Number, required: true },
  timezone: { type: String, required: true },
  authKey: { type: String, required: true},
  p256dhKey: { type: String, required: true},
});
subscriptionSchema.index({ timezone: 1, hour: 1 });
subscriptionSchema.plugin(plugin.created_at);
subscriptionSchema.plugin(plugin.updated_at);

module.exports = mongoose.model('ReminderSubscription', subscriptionSchema);
