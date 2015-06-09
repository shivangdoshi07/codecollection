//--- Following is executed when user hits /api/signout
var	redis = require('redis'),
	constants = require('../helper/constants');

var redis_client = redis.createClient();

module.exports = function(req,res){
	
	var token = req.headers.authorization;
	redis_client.del(token, function(err, reply) {
		res.status(200).json({status:200,message : constants.RES_MSG[200]});
	});
};
