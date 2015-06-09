/* Cache Handler */
var redis = require("redis");
var redis_client = redis.createClient();

redis_client.on('error',function(err){
});


var constants = require('../helper/constants');

var REDIS_KEYNAME = constants.REDIS_KEYNAME;

/* Cache Functions for Client
*/
exports.set = function(key,id,data){
	redis_client.hset(key, key+':'+id,JSON.stringify(data));
	redis_client.expire(key+':'+id,constants.REDIS_EXP_TIME);
};

exports.setAll = function(key,data){
	console.log("set all called from " + key);
	data.data.forEach(function(element, index, array){
		redis_client.hset(key, key+':'+element.client_id,JSON.stringify(element));
		redis_client.expire(key+':'+element.client_id,constants.REDIS_EXP_TIME);
	});
};

exports.get = function(key,id,callback){
	redis_client.hmget(key, key+':'+id, callback);
}

exports.getAll = function(key,callback){
	redis_client.hgetall(key, callback);
}

exports.expireCache = function(key,id){
	redis_client.expire(key+':'+id,0);
}

/** Set expiration for all client data */
exports.hasCacheExpired = function(key,callback){
	if(callback === "true" || callback === "false"){
		redis_client.set(key+'_expired',callback);
	}else{
		redis_client.get(key+'_expired',callback);
	}
}
