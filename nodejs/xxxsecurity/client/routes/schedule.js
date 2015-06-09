//--- Following is executed when user hits /api/schedule

var express = require('express'),
mq_client = require('../rpc/client'),
constants = require('../helper/constants'),
methods = require('../helper/methods');

var schedule = express.Router();

var QUEUE_NAME = constants.QUEUE_NAME;

/**Get All Schedule**/
schedule.get('/reports',function(req,res){

	methods.checkAuth(req,['ADMIN'],function(isAuth){
		if(isAuth){

			var msg_payload = {
					operation : "getAllScheduleReports",
					message : {}
			};

			mq_client.make_request(QUEUE_NAME.SCHEDULE,msg_payload,function(err,result){
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


/*
 * Schedule profile details
 */

schedule.get('/:id', function(req, res) {
	res.json({'result':'stub'});
});

/**get all alerts for a schedule**/
schedule.get('/:id/alert',function(req,res){

	var msg_payload = {
			operation : "getAlertsSchedule",
			message : {
				"schedule_id" : req.params.id
			}
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

/**get all checkpoint logs for a schedule**/
schedule.get('/:id/checkpoint_log',function(req,res){

	var msg_payload = {
			operation : "getCheckpointLogsSchedule",
			message : {
				"schedule_id" : req.params.id
			}
	};

	mq_client.make_request(QUEUE_NAME.CHECKPOINT,msg_payload, function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});

});


schedule.use(function(req,res,next){
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

/**Get All Schedule**/
schedule.get('/',function(req,res){

	var msg_payload = {
			operation : "getAllSchedule",
			message : {}
	};

	mq_client.make_request(QUEUE_NAME.SCHEDULE,msg_payload,function(err,result){
		if(err){
			res.status(err.status).json(err);
		}
		else 
		{
			res.status(result.status).json(result);
		}
	});
});

schedule.post('/',function(req,res){
	res.json({'result':'stub'});
});

schedule.put('/:id',function(req,res){
	res.json({'result':'stub'});
});

schedule.delete('/:id',function(req,res){
	res.json({'result':'stub'});
});

/*
 * Schedule meta details
 */

module.exports = (function() {
	'use strict';
	return schedule;
})();