//--- Following is executed when user hits /api/alert
var express = require('express'),
	mq_client = require('../rpc/client'),
	constants = require('../helper/constants'),
	methods = require('../helper/methods');

var alert = express.Router();

var cacheHandler = require('./cachehandler');
var REDIS_KEYNAME = constants.REDIS_KEYNAME;
var QUEUE_NAME = constants.QUEUE_NAME;

/*
 * Alert profile details
 */
alert.get('/chart',function(req,res){
	var msg_payload = {
		operation : "getAllAlertsForCharts",
		message : {}
	};
	
	mq_client.make_request(QUEUE_NAME.ALERT,msg_payload, function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

alert.get('/:id', function(req, res) {
	cacheHandler.get(REDIS_KEYNAME.CLIENT,req.params.id,function(err,reply){
		if(reply && reply[0] != null){
			/* Send the reply from cache after parsing it to JSON*/
			var result = {};
			result.status = 200;
			result.data = JSON.parse(reply);
			res.status(result.status).json(result);
		}else{
			mq_client.make_request(QUEUE_NAME.ALERT,msg_payload, function(err,result){
				if(err){
					res.status(err.status).json(err);
				}
				else 
				{
					res.json({'result':'stub'});
					/*res.status(result.status).json(result);
					cacheHandler.set(REDIS_KEYNAME.CLIENT,result.data[0].client_id,result.data);*/
				}
			});
		}
	});
});


alert.use(function(req,res,next){
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			next();
		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
});

alert.get('/',function(req,res){
	var msg_payload = {
		operation : "getAllAlerts",
		message : {}
	};
	
	mq_client.make_request(QUEUE_NAME.ALERT,msg_payload, function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

alert.post('/',function(req,res){
	res.json({'result':'stub'});
});

alert.put('/:id',function(req,res){
	/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.ALERT,req.params.id);
	res.json({'result':'stub'});
});

alert.delete('/:id',function(req,res){
	/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.ALERT,req.params.id);
	res.json({'result':'stub'});
});


module.exports = (function() {
	'use strict';
	return alert;
})();