/**fetch key in key-value pair**/
exports.getKeyByValue = function(obj,value ) {
	for( var key in obj ) {
		if( obj.hasOwnProperty( key ) ) {
			if( obj[ key ] == value )
				return key;
		}
	}
};

/**check user role and permission**/
exports.checkAuth = function(req,roles,callback){
	var redis = require('redis'),
		constants = require('./constants');
	
	var redis_client = redis.createClient();
	var isAuth = false;
	var token = req.headers.authorization;
	redis_client.hgetall(token,function(err,data){
		if(err){
			isAuth = false;
		}else{
			roles.forEach(function(role){
				if(Number(data.role) === Number(constants.ROLE[role])){
					/*callback(true);*/
					isAuth = true;
				}
			});
			/*callback(false);*/
		}
		callback(isAuth);
	});
};