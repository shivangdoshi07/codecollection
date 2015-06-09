var mysql = require('../helper/mysql'), 
constants = require('../helper/constants');

/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	'use strict';
	var operation = req.operation;
	var message = req.message;

	switch(operation){

	case "getCheckpointLogsSchedule" : 
		getCheckpointLogsSchedule(message,callback);
		break;
		
	case "getAllCheckpoints" : 
		getAllCheckpoints(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**get all checkpoint logs for a schedule**/
function getCheckpointLogsSchedule(msg,callback){
	
	var schedule_id = msg.schedule_id;
	mysql.query('SELECT cl.*,??,??,?? FROM ?? as cl,?? as c,?? as s WHERE ?? = ? AND ?? = ?? AND ?? = ??',
			['c.checkpoint_name','c.coords','s.date','checkpoint_log','checkpoint','schedule','cl.schedule_id',schedule_id,'cl.checkpoint_id','c.checkpoint_id','cl.schedule_id','s.schedule_id'],
			function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			callback({status : 200,data : response});
		}
	});
}

/**get all checkpoints of a building**/
function getAllCheckpoints(msg,callback){
	
	var building_id = msg.building_id;
	
	mysql.query('SELECT * FROM ?? WHERE ?? = ?',['checkpoint','building_id',building_id],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			callback({status : 200,data : response});
		}
	});
}