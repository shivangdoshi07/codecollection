//--- Following is executed when user hits /api/building
var express = require('express'),
	checkpoint = require('./checkpoint'),
	mq_client = require('../rpc/client'),
	methods = require('../helper/methods'),
	redis = require('redis'),
	constants = require('../helper/constants');

var building = express.Router();

var cacheHandler = require('./cachehandler');
var redis_client = redis.createClient();

var REDIS_KEYNAME = constants.REDIS_KEYNAME;
var QUEUE_NAME = constants.QUEUE_NAME;

/**Get all buildings**/
building.get('/', function(req, res) {
	var msg_payload = {
			operation : "getAllBuildings",
			message : {}
	};

	mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

/**Get Building**/
building.get('/:id', function(req, res) {
	if(!req.params.id){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "getBuilding",
				message : {
					building_id : req.params.id
				}
		};
		
		cacheHandler.get(REDIS_KEYNAME.BUILDING,req.params.id,function(err,reply){

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
					}else{
						res.status(result.status).json(result);
						cacheHandler.set(REDIS_KEYNAME.BUILDING,result.data[0].building_id,result.data);
					}
				});
			}
		});
	}
});


/**Get guards for a building**/
building.get('/:id/guard',function(req,res){
	if(!req.params.id){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "getBuildingGuards",
				message : {
					building_id : req.params.id 
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


/**Checkpoint handler**/
building.get('/:id/checkpoint',function(req,res){
	/*console.log(req.url);
	res.send("laga");*/
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

building.use(function(req,res,next){
	methods.checkAuth(req,['ADMIN','CLIENT'],function(isAuth){
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

/**Add Building**/
building.post('/',function(req,res){
	
	if(!req.body.name || !req.body.address || !req.body.state || !req.body.city || !req.body.zip_code || !req.body.client_id){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "addBuilding",
				message : {
					name : req.body.name,
					address : req.body.address,
					state : req.body.state,
					city : req.body.city,
					zip_code : req.body.zip_code,
					checkpoints : req.body.checkpoints,
					client_id : req.body.client_id
				}
		};
		
		mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
				/* Expire the cache so next get all call can rebuild it*/
				cacheHandler.hasCacheExpired(REDIS_KEYNAME.BUILDING,"true");
			}
		});
	}
	
});


/**Update Building**/
building.put('/:id',function(req,res){
	
	if(!req.params.id || !req.body.name || !req.body.address || !req.body.state || !req.body.city || !req.body.zip_code || !req.body.client_id || !req.body.service_fees || !req.body.status){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "updateBuilding",
				message : {
					building_id : req.params.id,
					name : req.body.name,
					address : req.body.address,
					state : req.body.state,
					city : req.body.city,
					zip_code : req.body.zip_code,
					client_id : req.body.client_id,
					service_fees : req.body.service_fees,
					status : req.body.status
				}
		};
		/*Expire cache of particular building which would be populated on next building get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.BUILDING,req.params.id);
		mq_client.make_request(QUEUE_NAME.BUILDING,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

/**Delete Building**/
building.delete('/:id',function(req,res){
	if(!req.params.id){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "deleteBuilding",
				message : {
					building_id : req.params.id
				}
		};
		/*Expire cache of particular building which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.BUILDING,req.params.id);
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
	return building;
})();