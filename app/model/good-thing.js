var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var plugin = appRequire('model/plugin');

var goodThingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  day: { type: Date, required: true },
  title: { type: String, required: true },
  details: String,
  image_url: String
});
goodThingSchema.index({ user: 1, day: -1 });
goodThingSchema.plugin(plugin.created_at);
goodThingSchema.plugin(plugin.updated_at);

module.exports = mongoose.model('GoodThing', goodThingSchema);
