//--- Following is executed when user hits /api/client
var express = require('express'),
client = express.Router(),
mq_client = require('../rpc/client'),
methods = require('../helper/methods'),
redis = require('redis'),
random_generator = require('../helper/random_generator'),
constants = require('../helper/constants');

var cacheHandler = require('./cachehandler');
var redis_client = redis.createClient();
var REDIS_KEYNAME = constants.REDIS_KEYNAME;
var QUEUE_NAME = constants.QUEUE_NAME;


/**Add a client**/
client.post('/',function(req,res){
	if(!req.body.email || !req.body.ssn || !req.body.firstname || !req.body.lastname || !req.body.password || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code || !req.body.contact_no || !req.body.start_date || !req.body.end_date){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "signup",
				message : {
					"client_id" : req.body.ssn,
					"email"		: req.body.email,
					"firstname" : req.body.firstname,
					"lastname" 	: req.body.lastname,
					"password" 	: req.body.password,
					"address"	: req.body.address,
					"city"		: req.body.city,
					"state"		: req.body.state,
					"zip_code"	: req.body.zip_code,
					"contact_no": req.body.contact_no,
					"start_date": req.body.start_date,
					"end_date"	: req.body.end_date,
					"role" 		: Number(constants.ROLE.CLIENT)
				}
		}; 

		mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload, function(err,results){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				var key = random_generator.generate();
				var role = Number(results.data.role);
				redis_client.hmset(key,{
					'person_id' : results.data.person_id,
					'role' : role
				},function(err,reply){
					if(err){
						res.status(500).json({
							status : 500,
							message : constants.RES_MSG[500]
						});
					}else{
						/*redis_client.expire(key, constants.REDIS_EXP_TIME);*/
						var role_name = methods.getKeyByValue(constants.ROLE,role);
						res.status(results.status).json({
							data : results.data,
							status : results.status,
							token : key,
							role :  role_name
						});
					}
				});
			}
		});
	}
});

/**Permission for both admin and client**/
client.use(function(req,res,next){
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


/**Get all clients**/
client.get('/',function(req,res){
	var msg_payload = {
			operation : "getAllClients",
			message : {}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload, function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

/**Get a client**/
client.get('/:id',function(req,res){
	if(!req.params.id){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "getClient",
				message : {
					client_id : req.params.id
				}
		};
		cacheHandler.get(REDIS_KEYNAME.CLIENT,req.params.id,function(err,reply){
			if(reply && reply[0] != null){
				/* Send the reply from cache after parsing it to JSON*/
				var result = {};
				result.status = 200;
				result.data = JSON.parse(reply);
				res.status(result.status).json(result);
			}else{
				mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload, function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
						cacheHandler.set(REDIS_KEYNAME.CLIENT,result.data[0].client_id,result.data);
					}
				});
			}
		});	
	}	
});


/**Get contracts of a client**/
client.get('/:id/contract',function(req,res){
	var msg_payload = {
			operation : "getClientContracts",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});

});


/* Generate bill from Admin*/
client.post('/:id/bill',function(req,res){
	var msg_payload = {
			operation : "createNewBill",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

/* Get all bill */
client.get('/:id/bill',function(req,res){
	var msg_payload = {
			operation : "getAllBill",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});


/**Get buildings of a client**/
client.get('/:id/building',function(req,res){
	var msg_payload = {
			operation : "getClientBuildings",
			message : {
				"client_id" : req.params.id
			}
	};


	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});


/**Get Balance of a client**/
client.get('/:id/balance',function(req,res){
	var msg_payload = {
			operation : "getBalance",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else
		{
			res.status(result.status).json(result);
		}
	});

});

/**Get alerts of a client**/
client.get('/:id/alert/chart',function(req,res){

	var msg_payload = {
			operation : "getClientAlertsForCharts",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});


/**Get alerts of a client**/
client.get('/:id/alert',function(req,res){

	var msg_payload = {
			operation : "getClientAlerts",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});


/**Get schedules of a client**/
client.get('/:id/schedule',function(req,res){

	var msg_payload = {
			operation : "getClientSchedules",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});



/**Get schedules for report of a client**/
client.get('/:id/scheduleForReport',function(req,res){

	var msg_payload = {
			operation : "getClientSchedulesForReport",
			message : {
				"client_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});





/****************************************/

/**Update client by client**/
client.put('/:id',function(req,res){
	methods.checkAuth(req,['CLIENT'],function(isAuth){
		if(isAuth){
			if(!req.params.id || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code || !req.body.contact_no){
				res.status(400).json({
					status : 400,
					message : constants.RES_MSG[400]
				});
			}else{
				var msg_payload = {
						operation : "updateClient",
						message : {
							"person_id" : req.params.id,
							"firstname" : req.body.firstname,
							"lastname" 	: req.body.lastname,
							"address"	: req.body.address,
							"city"		: req.body.city,
							"state"		: req.body.state,
							"zip_code"	: req.body.zip_code,
							"contact_no": req.body.contact_no
						}
				}; 
				/*Expire cache of particular client which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.CLIENT,req.params.id);
				mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload, function(err,result){
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

/****************************************/

client.delete('/:id',function(req,res){

	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){

			if(!req.params.id){
				res.status(400).json({
					status : 400,
					message : constants.RES_MSG[400]
				});
			}else{
				var msg_payload = {
						operation : "deleteClient",
						message : {
							client_id : req.params.id
						}
				};
				/*Expire cache of particular client which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.CLIENT,req.params.id);
				mq_client.make_request(QUEUE_NAME.CLIENT,msg_payload,function(err,result){
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


module.exports = (function(){
	return client;
})();