var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var goodThingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  day: { type: Date, required: true },
  title: { type: String, required: true },
  details: String,
  image_url: String,
  created_at: Date,
  updated_at: Date
});
goodThingSchema.index({ user: 1, day: -1 });

module.exports = mongoose.model('GoodThing', goodThingSchema);
