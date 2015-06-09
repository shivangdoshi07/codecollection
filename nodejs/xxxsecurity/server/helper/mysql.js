var redis = require("redis");
var mysql = require('mysql'), config = require('./config'), constants = require('../helper/constants');
var db = config.db,
	poolConfig = config.dbPool,
	pool = [];

var redis_client = redis.createClient();

redis_client.on('error',function(err){
});

var conn;
var REDIS_KEYS = constants.REDIS_KEYS;
/**
 * Method to create database
 */
function createConnection(){
	return mysql.createConnection({
		host : db.host,
		port : db.port,
		user : db.user,
		password : db.password,
		database : db.database,
		multipleStatements: true
	});
}

/**
 * Creating Connection Pool
 */
exports.createConnectionPool =function (){
	for(var i =0;i<poolConfig.maxSize;i++){
		pool.push(createConnection());
	}
};


/**
 * Function to get connection from pool
 * @returns connection
 */
function getConnectionFromPool(){
	if(pool.length<=0){
		console.log("Empty Pool");
		return null;
	}else{
		/*console.log("Pool length");
		console.log(pool.length);*/
		return pool.pop();
	}
}

/*
 * Function to query database w
*/
function queryDatabase(queryString, params, callback){
	var selectIndex = queryString.toUpperCase().indexOf("SELECT");
	var connection = getConnectionFromPool();
	if(connection){
		if (arguments.length == 3) {
			var sql = mysql.format(queryString, params);
			console.log(sql);
			connection.query(sql, function(err, rows, field) {
				if (err) {
					console.log(err);
					callback(err);
				} else {
					if(selectIndex > -1 && selectIndex < 10)
						redis_client.hset(REDIS_KEYS.QUERYHASH,sql,JSON.stringify(rows));
					callback(null, rows);
				}
				pool.push(connection);
			});
		} else {
			callback = params;
			connection.query(queryString, function(err, rows, field) {
				if (err) {
					console.log(err);
					callback(err);
				} else {
					if(selectIndex > -1 && selectIndex < 10)
						redis_client.hset(REDIS_KEYS.QUERYHASH,sql,JSON.stringify(rows));
					callback(null, rows);
				}
				pool.push(connection);
			});
		}
	}else{
		console.log("No connection found");
	}
}

/**
 * Method to query database
 */
exports.query = function(queryString, params, callback) {
	var selectIndex = queryString.toUpperCase().indexOf("SELECT");
	var sql 		= mysql.format(queryString, params);
	if( selectIndex > -1 && selectIndex < 10){
		redis_client.hget(REDIS_KEYS.QUERYHASH,sql,function(err,reply){
			if(!reply || reply == null){
				queryDatabase(queryString, params, callback);
			}else{
				callback(null,JSON.parse(reply));
			}
		});
	}else{
		redis_client.expire(REDIS_KEYS.QUERYHASH,0);
		queryDatabase(queryString, params, callback);
	}
};

exports.createSql = function (queryString, params){
	var sql = mysql.format(queryString, params);
	return sql;
};

exports.multipleQuery = function(multiQuery,callback){

	var selectIndex = multiQuery.toUpperCase().indexOf("SELECT");
	console.log(mysql.format(multiQuery));
	if( selectIndex > -1 && selectIndex < 10){
		redis_client.hget(REDIS_KEYS.QUERYHASH,multiQuery,function(err,reply){
			if(!reply || reply == null){
				var connection = getConnectionFromPool();
				if(connection){
					connection.query(multiQuery, function(err, results) {
					  if (err) throw err;
					  callback(null, results);
					  redis_client.hset(REDIS_KEYS.QUERYHASH,multiQuery,JSON.stringify(results));
					  pool.push(connection);
					});
				}
			}else{
				callback(null,JSON.parse(reply));
			}
		});
	}else{
		redis_client.expire(REDIS_KEYS.QUERYHASH,0);
		var connection = getConnectionFromPool();
		if(connection){
			connection.query(multiQuery, function(err, results) {
			  if (err) throw err;
			  callback(null, results);
			  redis_client.hset(REDIS_KEYS.QUERYHASH,multiQuery,JSON.stringify(results));
			  pool.push(connection);
			});
		}
	}
}
