//--- Following is executed when user hits /api/checkpoint

var express = require('express'),
	mq_client = require('../rpc/client'),
	methods = require('../helper/methods'),
	constants = require('../helper/constants');

var checkpoint = express.Router();

var cacheHandler = require('./cachehandler');
var REDIS_KEYNAME = constants.REDIS_KEYNAME;
var QUEUE_NAME = constants.QUEUE_NAME;

/**Get all checkpoints for the building**/
checkpoint.get('/', function(req, res) {
	if(!req.params.id){
		res.status(400).json({status : 400,message : constants.res_msg[400]});
	}else{
		var msg_payload = {
			operation : "getAllCheckpoints",
			message : {
				building_id : req.params.id
			}
		};
		
		mq_client.make_request(QUEUE_NAME.CHECKPOINT,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

/**Get the checkpoint**/
checkpoint.get('/:checkpoint_id', function(req, res) {
	if(!req.params.id || !req.params.checkpoint_id){
		res.status(400).json({status : 400,message : constants.res_msg[400]});
	}else{
		var msg_payload = {
				operation : "getCheckpoint",
				message : {
					checkpoint_id : req.params.checkpoint_id
				}
		};
		
		cacheHandler.get(REDIS_KEYNAME.CHECKPOINT,req.params.id,function(err,reply){
			if(reply && reply[0] != null){
				/* Send the reply from cache after parsing it to JSON*/
				var result = {};
				result.status = 200;
				result.data = JSON.parse(reply);
				res.status(result.status).json(result);
			}else{
				mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
						cacheHandler.set(REDIS_KEYNAME.CHECKPOINT,result.data[0].checkpoint_id,result.data);
					}
				});
			}
		});
	}
});


checkpoint.use(function(req,res,next){
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


/**Add checkpoint**/
checkpoint.post('/',function(req,res){
	if(!req.params.id || !req.body.checkpoint_name || !req.body.coords){
		res.status(400).json({status : 400,message : constants.res_msg[400]});
	}else{
		var msg_payload = {
				operation : "addCheckpoint",
				message : {
					building_id : req.params.id,
					checkpoint_name : req.body.checkpoint_name, 
					coords : req.body.coords
				}
		};
		
		mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

checkpoint.put('/:checkpoint_id',function(req,res){
	if(!req.params.id || !req.params.checkpoint_id || !req.body.checkpoint_name || !req.body.coords){
		res.status(400).json({status : 400,message : constants.res_msg[400]});
	}else{
		var msg_payload = {
				operation : "updateCheckpoint",
				message : {
					checkpoint_id : req.params.checkpoint_id,
					building_id : req.params.id,
					checkpoint_name : req.body.checkpoint_name, 
					coords : req.body.coords
				}
		};
		/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.CHECKPOINT,req.params.checkpoint_id);
		mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

checkpoint.delete('/:checkpoint_id',function(req,res){
	if(!req.params.id || !req.params.checkpoint_id){
		res.status(400).json({status : 400,message : constants.res_msg[400]});
	}else{
		var msg_payload = {
				operation : "deleteCheckpoint",
				message : {
					checkpoint_id : req.params.checkpoint_id
				}
		};
		/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.CHECKPOINT,req.params.checkpoint_id);
		mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});


module.exports = (function() {
	'use strict';
	return checkpoint;
})();