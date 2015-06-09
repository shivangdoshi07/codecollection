//--- Following is executed when user hits /api/user

var express = require('express'),
mq_client = require('../rpc/client'),
constants = require('../helper/constants'),
methods = require('../helper/methods');

var contract = express.Router();

var cacheHandler = require('./cachehandler');

var REDIS_KEYNAME = constants.REDIS_KEYNAME;
var QUEUE_NAME = constants.QUEUE_NAME;

/**contract permission only to client and admin**/
contract.use(function(req,res,next){
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

/**get all contracts**/
contract.get('/', function(req, res) {
	
	if(req.params.id){
		/** /api/client/id/contract/ **/
		var msg_payload = {
				operation : "getAllContractByClient",
				message : {
					"client_id"	: req.params.id
				}
		}; 

		mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});

	}else{

		/** /api/contract/ **/
		methods.checkAuth(req,['ADMIN'],function(isAuth){
			if(isAuth){
				var msg_payload = {
						operation : "getAllContractByAdmin",
						message : {}
				}; 

				mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
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
		});	
	}
});


/**get all contract requests**/
contract.get('/requests',function(req,res){
	
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			
			var msg_payload = {
					operation : "getContractRequests",
					message : {}
			}; 

			mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
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
	});
	
	
});


contract.get('/:contract_id', function(req, res) {
	var msg_payload = {
			operation : "getContract",
			message : {
				'contract_id' : req.params.contract_id
			}
	}; 

	cacheHandler.get(REDIS_KEYNAME.CONTRACT,req.params.contract_id,function(err,reply){

			if(reply && reply[0] != null){
				/* Send the reply from cache after parsing it to JSON*/
				var result = {};
				result.status = 200;
				result.data = JSON.parse(reply);
				res.status(result.status).json(result);
			}else{
				mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
					if(err){
						res.status(err.status).json(err);
					}
					else 
					{
						res.status(result.status).json(result);
						cacheHandler.set(REDIS_KEYNAME.CONTRACT,result.data[0].contract_id,result.data);
					}
				});
			}
		});
});

contract.post('/',function(req,res){
	console.log(req.body);
	var msg_payload = {
			operation : "addContract",
			message : {
				'start_date'	: req.body.start_date, 
				'end_date'		: req.body.end_date,
				'no_of_guards'	: req.body.no_of_guards,
				'building_id' 	: req.body.building_id,
				'status' 		: 'request'
			}
	}; 

	mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});


/**delete contract**/
contract.delete('/:contract_id',function(req,res){

	methods.checkAuth(req,['ADMIN'],function(isAuth){
		var msg_payload="";
		if(isAuth){
			msg_payload = {
					operation : "deleteContractByAdmin",
					message : {
						'contract_id' 	: req.params.contract_id
					}
			}; 
		}else{
			msg_payload = {
					operation : "deleteContractByClient",
					message : {
						'contract_id' 	: req.params.contract_id
					}
			}; 
		}
		/*Expire cache of particular client which would be populated on next client get call*/
				cacheHandler.expireCache(REDIS_KEYNAME.CONTRACT,req.params.id);
		mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});

	});
});


/**accept/update contract by admin**/
contract.put('/:contract_id',function(req,res){
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			
			
			if(req.body.status==="active"){
				
				if(!req.params.contract_id || !req.body.start_date || !req.body.end_date || !req.body.no_of_guards || !req.body.building_id || !req.body.status){
					res.status(400).json({
						status : 400,
						message : constants.RES_MSG[400]
					});
				}else{
					msg_payload = {
							operation : "updateContractByAdmin",
							message : {
								'contract_id' 	: req.params.contract_id,
								'start_date'	: req.body.start_date, 
								'end_date'		: req.body.end_date,
								'no_of_guards' 	: req.body.no_of_guards,
								'building_id' 	: req.body.building_id,
								'status' 		: req.body.status
							}
					};
					/*Expire cache of particular client which would be populated on next client get call*/
						cacheHandler.expireCache(REDIS_KEYNAME.CONTRACT,req.params.contract_id);
						mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
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
				
				if(!req.params.contract_id || !req.body.status){
					res.status(400).json({
						status : 400,
						message : constants.RES_MSG[400]
					});
				}else{
					msg_payload = {
							operation : "updateContractByAdmin",
							message : {
								'contract_id' 	: req.params.contract_id,
								'status' 		: req.body.status
							}
					};
					/*Expire cache of particular client which would be populated on next client get call*/
						cacheHandler.expireCache(REDIS_KEYNAME.CONTRACT,req.params.contract_id);
						mq_client.make_request(QUEUE_NAME.CONTRACT,msg_payload, function(err,result){
						if(err){
							res.status(err.status).json(err);
						}
						else 
						{
							res.status(result.status).json(result);
						}
					});
				}
				
			}
		}else{
			res.status(403).json({
				status : 403,
				message : constants.RES_MSG[403]
			});
		}
	});	
});


module.exports = (function() {
	'use strict';
	return contract;
})();