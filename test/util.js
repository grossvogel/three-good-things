const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

global.appRequire = function(name) {
	return require(path.join(__dirname, '../app/' + name));
}

module.exports = {
	config: require('../config'),
	db: appRequire('db'),
	dropCollection: function(collection, done) {
		mongoose.connection.collections[collection].drop(function(_err){
      done();
    });
	}
};
