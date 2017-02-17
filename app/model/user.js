var mongoose = require('mongoose');
var plugin = appRequire('model/plugin');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, index: true }
});
userSchema.plugin(plugin.created_at);

module.exports = mongoose.model('User', userSchema);
