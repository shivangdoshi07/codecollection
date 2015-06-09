var mysql = require('../helper/mysql'), 
encryption = require('../helper/encryption'),
constants = require('../helper/constants');

/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	'use strict';
	var operation = req.operation;
	var message = req.message;

	switch(operation){

	case "getAllSchedule" : 
		getAllSchedule(message,callback);
		break;
		
	case "getAllScheduleReports" : 
		getAllScheduleReports(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**Get All Schedule**/
function getAllSchedule(msg,callback){
	
	mysql.query('SELECT * FROM ??',['schedule'],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({
				status : 200,
				data : response
			});
		}
	});
}

/**Get All Schedule**/
function getAllScheduleReports(msg,callback){
	
	mysql.query('SELECT * FROM ?? WHERE date_format(str_to_date(??,"%m-%d-%Y"),"%Y-%m-%d") < curdate()',
			['schedule','date'],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({
				status : 200,
				data : response
			});
		}
	});
}