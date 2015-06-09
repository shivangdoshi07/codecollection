//--- Following is executed when user hits /api/guard

var express = require('express'),
mq_client = require('../rpc/client'),
constants = require('../helper/constants'),
methods = require('../helper/methods');

var guard = express.Router();
var cacheHandler = require('./cachehandler');
var REDIS_KEYNAME = constants.REDIS_KEYNAME;

var QUEUE_NAME = constants.QUEUE_NAME;

/**Get All Guards**/
guard.get('/', function(req, res) {

	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			var msg_payload = {
					operation : "getAllGuards",
					message : {}
			};

			mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
				if(err){
					res.status(err.status).json(err);
				}
				else {
					res.status(result.status).json(result);
				}
			});

		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});

});

/**Get count of available guards**/
guard.get('/available',function(req,res){
	
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			var msg_payload = {
					operation : "getCountAvailableGuards",
					message : {}
			};

			mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
				if(err){
					res.status(err.status).json(err);
				}
				else {
					res.status(result.status).json(result);
				}
			});

		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
	
});

/**Get count of guards for charts**/
guard.get('/chart',function(req,res){
	
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			var msg_payload = {
					operation : "getCountGuardsForCharts",
					message : {}
			};

			mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
				if(err){
					res.status(err.status).json(err);
				}
				else {
					res.status(result.status).json(result);
				}
			});

		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
	
});

/**Get Guard**/
guard.get('/:id', function(req, res) {
	if(!req.params.id){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "getGuard",
				message : {
					guard_id : req.params.id
				}
		};

		cacheHandler.get(REDIS_KEYNAME.GUARD,req.params.id,function(err,reply){
			if(reply && reply[0] != null){
				/* Send the reply from cache after parsing it to JSON*/
				var result = {};
				result.status = 200;
				result.data = JSON.parse(reply);
				res.status(result.status).json(result);
			}else{
				mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
						cacheHandler.set(REDIS_KEYNAME.GUARD,result.data[0].guard_id,result.data);
					}
				});
			}
		});
	}
});

/**Add Guard**/
guard.post('/',function(req,res){

	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			if(!req.body.email || !req.body.ssn || !req.body.firstname || !req.body.lastname ||!req.body.password || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code || !req.body.start_date || !req.body.end_date || !req.body.wkly_wrk_hrs || !req.body.bg_status || !req.body.is_occupied){
				res.status(400).json({
					status : 400,
					message : constants.RES_MSG[400]
				});
			}else{
				var msg_payload = {
						operation : "signup",
						message : {
							"guard_id"		: req.body.ssn,
							"email"			: req.body.email,
							"firstname" 	: req.body.firstname,
							"lastname" 		: req.body.lastname,
							"password" 		: req.body.password,
							"address"		: req.body.address,
							"city"			: req.body.city,
							"state"			: req.body.state,
							"zip_code"		: req.body.zip_code,
							"contact_no"	: req.body.contact_no,
							"start_date"	: req.body.start_date,
							"end_date"		: req.body.end_date,
							"role" 			: Number(constants.ROLE.GUARD),
							"wkly_wrk_hrs" 	: req.body.wkly_wrk_hrs,
							"bg_status" 	: req.body.bg_status,
							"is_occupied"	: req.body.is_occupied
						}
				}; 

				mq_client.make_request(QUEUE_NAME.GUARD,msg_payload, function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						/*req.session.email = req.body.email;*/
						res.status(result.status).json(result);
					}
				});
			}
		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
});

/**Update Guard**/
guard.put('/:id',function(req,res){

	methods.checkAuth(req,['GUARD','ADMIN'],function(isAuth){
		if(isAuth){
			if(!req.params.id || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code || !req.body.contact_no){
				res.status(400).json({
					status : 400,
					message : constants.RES_MSG[400]
				});
			}else{
				var msg_payload = {
						operation : "updateGuard",
						message : {
							"person_id"		: req.params.id,
							"address"		: req.body.address,
							"city"			: req.body.city,
							"state"			: req.body.state,
							"zip_code"		: req.body.zip_code,
							"contact_no"	: req.body.contact_no
						}
				}; 
				/*Expire cache of particular client which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.GUARD,req.params.id);
				mq_client.make_request(QUEUE_NAME.GUARD,msg_payload, function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
					}
				});
			}
		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
});

guard.delete('/:id',function(req,res){
	
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			if(!req.params.id){
				res.status(400).json({
					status : 400,
					message : constants.RES_MSG[400]
				});
			}else{
				var msg_payload = {
						operation : "deleteGuard",
						message : {
							guard_id : req.params.id
						}
				};
				/*Expire cache of particular client which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.GUARD,req.params.id);
				mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
					}
				});
			}
		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});
});


/**Get guard schedule**/
guard.get('/:id/schedule',function(req,res){
	if(!req.params.id){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "getGuardSchedule",
				message : {
					guard_id : req.params.id
				}
		};
		mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});	
	}
});




/**Get guard alerts**/
guard.get('/:id/alert',function(req,res){
	if(!req.params.id){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "getGuardAlert",
				message : {
					guard_id : req.params.id
				}
		};
		mq_client.make_request(QUEUE_NAME.GUARD,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});	
	}
});













module.exports = (function() {
	'use strict';	
	return guard;
})();
