var express = require('express'),
	redis = require("redis");

var signin = require('./signin'),
	signout = require('./signout'),
	client = require('./client'),
	contract = require('./contract'),
	building = require('./building'),
	guard = require('./guard'),
	report = require('./report'),
	schedule = require('./schedule'),
	search = require('./search'),
	admin = require('./admin'),
	alert = require('./alert');
	

var api = express.Router();
var redis_client = redis.createClient();

/**Handlers**/
api.use('/signin',signin);
api.use('/signout',signout);
api.use('/client',client);
api.use('/admin', admin);
api.use('/building', building);
api.use('/contract', contract);
api.use('/guard', guard);
api.use('/report', report);
api.use('/schedule', schedule);
api.use('/search', search);
api.use('/alert', alert);

	
module.exports = (function() {
	return api;
})();