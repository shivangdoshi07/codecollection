//--- Following is executed when user hits /api/report
var express = require('express'),
	client = express.Router(),
	mq_client = require('../rpc/client'),
	constants = require('../helper/constants'),
	methods = require('../helper/methods');

var QUEUE_NAME = constants.QUEUE_NAME;

var report = express.Router();

/*
 * Report details
 */


report.get('/:id', function(req, res) {
	methods.checkAuth(req,['ADMIN','CLIENT'],function(isAuth){
		if(isAuth){
			var msg_payload = {
					operation : "getReport",
					message : {
						report_id : req.param.id
					}
			};
			cacheHandler.get(REDIS_KEYNAME.REPORT,req.params.id,function(err,reply){
				if(reply && reply[0] != null){
					/* Send the reply from cache after parsing it to JSON*/
					var result = {};
					result.status = 200;
					result.data = JSON.parse(reply);
					res.status(result.status).json(result);
				}else{
					mq_client.make_request(QUEUE_NAME.REPORT,msg_payload,function(err,result){
						if(err){
							res.status(err.status).json(err);
						}
						else 
						{
							res.status(result.status).json(result);
							cacheHandler.set(REDIS_KEYNAME.REPORT,result.data[0].report_id,result.data);
						}
					});
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


report.use(function(req,res,next){
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

report.get('/',function(req,res){
	
	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){
			
			var msg_payload = {
					operation : "getAllReports",
					message : {
						report_id : req.param.id
					}
			};

			mq_client.make_request(QUEUE_NAME.REPORT,msg_payload,function(err,result){
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




report.post('/',function(req,res){
	if(!req.body.schedule_id || !req.body.description){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "addReport",
				message : {
					schedule_id : req.body.schedule_id,
					description : req.body.description
				}
		};
		
		mq_client.make_request(QUEUE_NAME.REPORT,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

report.put('/:id',function(req,res){
	if(!req.params.id || !req.body.name || !req.body.address || !req.body.state || !req.body.city || !req.body.zip_code || !req.body.client_id || !req.body.service_fees){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "updateReport",
				message : {
					report_id 	: msg.report_id,
					schedule_id : msg.schedule_id,
					description : msg.description,
				}
		};
		/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.REPORT,req.params.id);
		mq_client.make_request(QUEUE_NAME.REPORT,msg_payload,function(err,result){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(result.status).json(result);
			}
		});
	}
});

report.delete('/:id',function(req,res){
	if(!req.params.id){
		res.status(400).json({status : 400,message : constants.RES_MSG[400]});
	}else{
		var msg_payload = {
				operation : "deleteReport",
				message : {
					report_id : req.params.id
				}
		};
		/*Expire cache of particular client which would be populated on next client get call*/
		cacheHandler.expireCache(REDIS_KEYNAME.REPORT,req.params.id);
		mq_client.make_request(QUEUE_NAME.REPORT,msg_payload,function(err,result){
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
	return report;
})();