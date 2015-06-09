//--- Following is executed when user hits /api/admin
var express = require('express'),
mq_client = require('../rpc/client'),
constants = require('../helper/constants'),
methods = require('../helper/methods'),
redis = require('redis');

var redis_client = redis.createClient();


redis_client.on('error',function(err){
});

var admin = express.Router();

var QUEUE_NAME = constants.QUEUE_NAME;

admin.use(function(req,res,next){
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

admin.get('/:token',function(req,res){

	var token = req.params.token;
	redis_client.hgetall(token,function(err,data){
		if(err){
			res.status(500).json({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			if(data){
				var person_id = data.person_id;

				var msg_payload = {
						operation : "getAdmin",
						message : {
							"person_id" : person_id
						}
				};

				mq_client.make_request(QUEUE_NAME.ADMIN,msg_payload, function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else
					{
						res.status(result.status).json(result);
					}
				});

			}else{
				res.status(403).json({
					status : 403,
					message : constants.RES_MSG[403]
				});
			}
		}
	});

});

/**Add admin**/
admin.post('/',function(req,res){
	if(!req.body.email || !req.body.firstname || !req.body.lastname || !req.body.password || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "signup",
				message : {
					"email"		: req.body.email,
					"firstname" : req.body.firstname,
					"lastname" 	: req.body.lastname,
					"password" 	: req.body.password,
					"address"	: req.body.address,
					"city"		: req.body.city,
					"state"		: req.body.state,
					"zip_code"	: req.body.zip_code,
					"contact_no": req.body.contact_no,
					"role" 		: Number(constants.ROLE.ADMIN)
				}
		};

		mq_client.make_request(QUEUE_NAME.ADMIN,msg_payload, function(err,result){
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

/**Update admin**/
admin.put('/:id',function(req,res){
	if(!req.params.id || !req.body.address || !req.body.city || !req.body.state || !req.body.zip_code || !req.body.contact_no){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "update",
				message : {
					"person_id" : req.params.id,
					"address"	: req.body.address,
					"city"		: req.body.city,
					"state"		: req.body.state,
					"zip_code"	: req.body.zip_code,
					"contact_no": req.body.contact_no
				}
		};

		mq_client.make_request(QUEUE_NAME.ADMIN,msg_payload, function(err,result){
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

/**Update guard details**/
admin.put('/guard/:id',function(req,res){
	if(!req.params.id || !req.body.start_date || !req.body.end_date || !req.body.wkly_wrk_hrs || !req.body.bg_status || !req.body.is_occupied){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "updateGuardsByAdmin",
				message : {
					"guard_id"		: req.params.id,
					"start_date"	: req.body.start_date,
					"end_date" 		: req.body.end_date,
					"wkly_wrk_hrs" 	: req.body.wkly_wrk_hrs,
					"bg_status" 	: req.body.bg_status,
					"is_occupied" 	: req.body.is_occupied
				}
		};

		mq_client.make_request(QUEUE_NAME.ADMIN,msg_payload, function(err,result){
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


/**Update client details**/
admin.put('/client/:id',function(req,res){
	if(!req.params.id || !req.body.start_date || !req.body.end_date || !req.body.monthly_service_charge || !req.body.balance){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "updateClientByAdmin",
				message : {
					"client_id"		: req.params.id,
					"start_date"	: req.body.start_date,
					"end_date" 		: req.body.end_date,
					"monthly_service_charge" : req.body.monthly_service_charge,
					"balance" 		: req.body.balance
				}
		};

		mq_client.make_request(QUEUE_NAME.ADMIN,msg_payload, function(err,result){
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
	return admin;
})();
