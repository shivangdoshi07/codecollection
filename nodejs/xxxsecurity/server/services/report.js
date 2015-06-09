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

	case "addReport" : 
		addReport(message,callback);
		break;

	case "getReport" : 
		getReport(message,callback);
		break;

	case "getReports" : 
		getAllReports(message,callback);
		break;

	case "updateReport" : 
		updateReport(message,callback);
		break;

	case "deleteReport" : 
		deleteReport(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**Add building**/
function addReport(msg,callback){
	var queryParam = {
				schedule_id : msg.schedule_id,
				description : msg.description,
				timestamp : Date.now() / 1000 | 0
		};
		mysql.query('INSERT INTO ?? SET ?',['report',queryParam],function(err,response){
			if(err){
				console.log("Error while perfoming query !!!");
				callback({
					status : 500,
					message : constants.RES_MSG[500]
				});
			}else{
				callback({
					status : 200,
					data : {
						report_id : response.insertId,
					}
				});
			}
		});
}

/**Get Report**/
function getReport(msg,callback){

	mysql.query('SELECT * from ?? WHERE report_id = ?',['report', msg.report_id],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({status : 200,data : response});
		}
	});

}

/**Get all Reports**/
function getAllReports(msg,callback){

	mysql.query('SELECT * from ??',['report'],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({status : 200,data : response});
		}
	});

}

/**Update building**/
function updateReport(msg,callback){
	var queryParam = {
				schedule_id : msg.schedule_id,
				description : msg.description,
				timestamp : Date.now() / 1000 | 0
		};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['report',queryParam,'report_id',msg.report_id],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({
				status : 200,
				message : constants.RES_MSG[200]
			});
		}
	});
}

/**Delete building**/
function deleteReport(msg,callback){
	mysql.query("DELETE FROM ?? WHERE ?? = ?",['report','report_id',msg.report_id],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			callback({
				status : 200,
				message : constants.RES_MSG[200]
			});
		}
	});
}