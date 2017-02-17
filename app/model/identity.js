var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identitySchema = new Schema({
  key: { type: String, required: true },
  provider: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
  secret: String,
  created_at: Date,
  expires_at: Date
});
identitySchema.index({ key: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Identity', identitySchema);
module.exports.provider = {
  google: 'google',
  local: 'local',
};
