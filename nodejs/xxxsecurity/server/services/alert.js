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

	case "getAllAlerts" : 
		getAllAlerts(message,callback);
		break;
	case "getAllAlertsForCharts" : 
		getAllAlertsForCharts(message,callback);
		break;
	
	case "getAlertsSchedule" : 
		getAlertsSchedule(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**get all alerts**/
function getAllAlerts(msg,callback){
	
	mysql.query('SELECT als.*,??,??,??,??,??,??,?? FROM ?? as als,?? as a,?? as s WHERE ?? = ?? AND ?? = ??',
			['a.description','s.date','s.guard_id','s.guard_name','s.client_name','s.building_name','s.contract_id','alert_schedule','alert','schedule','als.alert_id','a.alert_id','als.schedule_id','s.schedule_id'],
			function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			callback({status : 200,data : response});
		}
	});
}

/**get all alerts for charts**/
function getAllAlertsForCharts(msg,callback){
	
	mysql.query('SELECT COUNT(*) as count, als.*,??,??,??,??,??,??,?? FROM ?? as als,?? as a,?? as s WHERE ?? = ?? AND ?? = ?? GROUP BY ??',
			['a.description','s.date','s.guard_id','s.guard_name','s.client_name','s.building_name','s.contract_id','alert_schedule','alert','schedule','als.alert_id','a.alert_id','als.schedule_id','s.schedule_id','s.date'],
			function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			callback({status : 200,data : response});
		}
	});
}

/**get all alerts for a schedule**/
function getAlertsSchedule(msg,callback){
	
	var schedule_id = msg.schedule_id;
	mysql.query('SELECT als.*,??,?? FROM ?? as als,?? as a,?? as s WHERE ?? = ? AND ?? = ?? AND ?? = ??',
			['a.description','s.date','alert_schedule','alert','schedule','als.schedule_id',schedule_id,'als.alert_id','a.alert_id','als.schedule_id','s.schedule_id'],
			function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			callback({status : 200,data : response});
		}
	});
}