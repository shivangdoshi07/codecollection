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

	case "signup" : 
		signup(message,callback);
		break;

	case "getAllGuards" : 
		getAllGuards(message,callback);
		break;

	case "getGuard" : 
		getGuard(message,callback);
		break;

	case "updateGuard" : 
		updateGuard(message,callback);
		break;

	case "deleteGuard" : 
		deleteGuard(message,callback);
		break;

	case "getGuardSchedule" : 
		getGuardSchedule(message,callback);
		break;		
		
	case "getGuardAlert" : 
		getGuardAlert(message,callback);
		break;
		
	case "getCountAvailableGuards" :
		getCountAvailableGuards(message,callback);
		break;
	case "getCountGuardsForCharts" :
		getCountGuardsForCharts(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};


/**
 * Add guard
 */
function signup(msg,callback) {

	encryption.encryptPass(msg.password,function(err, salt, hash) {
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			/** Converting hash and salt to base64 in order to keep them in DB **/
			var email = msg.email,
				guard_id = msg.guard_id,
				username = msg.firstname + " " + msg.lastname;

			var queryParam = {
					email		: email,
					firstname	: msg.firstname,
					lastname	: msg.lastname,
					password	: hash.toString("base64"),
					salt		: salt.toString('base64'),
					address		: msg.address,
					contact_no	: msg.contact_no,
					city		: msg.city,
					state		: msg.state,
					zip_code	: msg.zip_code,
					role		: msg.role
			};

			/**First check whether guard already exist**/
			mysql.query("SELECT * FROM ?? as ?? JOIN ?? as ?? on ?? = ?? where ?? = ? OR ?? = ?",['person', 'p', 'guard', 'g' ,'p.person_id' ,'g.person_id' ,'email',email, 'guard_id', guard_id],function(err,response) {
				if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});

				} else if (response.length > 0) {
					callback({status : 400,message : constants.RES_MSG[400]});
				} else {
					/**
					 * No guard found with the email id, create new user
					 */
					mysql.query("INSERT INTO ?? SET ?",['person',queryParam],function(err,response) {
						if (err) {
							console.log("Error while perfoming query !!!");
							callback({status : 500,message : constants.RES_MSG[500]});
						} else {
							/**
							 * Inserting client data into client table with person_id
							 */
							var person_id = response.insertId;
							queryParam = {
								"person_id" 	: person_id,
								"guard_id"		: guard_id,
								"start_date"	: msg.start_date,
								"end_date" 		: msg.start_date,
								"wkly_wrk_hrs" 	: msg.wkly_wrk_hrs,
								"bg_status" 	: msg.bg_status,
								"is_occupied" 	: msg.is_occupied
							};
							mysql.query("INSERT INTO ?? SET ?",['guard',queryParam],function(err,response) {
								if (err) {
									console.log("Error while perfoming query !!!");
									callback({status : 500,message : constants.RES_MSG[500]});
								} else {
									callback({
										status : 200,
										data : {
											person_id	: person_id,
											guard_id 	: guard_id,
											email 		: email,
											name 		: username
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

/**Get all guards**/
function getAllGuards(msg,callback){
	mysql.query('SELECT ??,??,??,??,??,??,??,??,??,??,??,??,??,??,?? FROM ?? as p,?? as g WHERE ?? = ??',
		['g.guard_id','p.person_id','p.email','p.firstname','p.lastname','p.address','p.city','p.state','p.zip_code','g.start_date','g.end_date','g.wkly_wrk_hrs','g.bg_status','g.is_occupied','p.contact_no','person','guard','g.person_id','p.person_id'],
		function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});								
		}
	});
}


/**Get guard**/
function getGuard(msg,callback){

	mysql.query('SELECT ??,??,??,CONCAT_WS(" ",??,??) as guard_name,??,??,??,??,??,??,??,??,??,?? FROM ?? as p,?? as g WHERE ?? = ?? AND ?? = ?',
		['g.guard_id','p.person_id','p.email','p.firstname','p.lastname','p.address','p.city','p.state','p.zip_code','g.start_date','g.end_date','g.wkly_wrk_hrs','g.bg_status','g.is_occupied','p.contact_no','person','guard','g.person_id','p.person_id','g.person_id',msg.guard_id],
		function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});								
		}
	});
}

/**Update Guard**/
function updateGuard(msg,callback){
	var queryParam = {
					address		: msg.address,
					contact_no	: msg.contact_no,
					city		: msg.city,
					state		: msg.state,
					zip_code	: msg.zip_code
			};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['person',queryParam,'person_id',msg.person_id],function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,message : constants.RES_MSG[200]});
		}		
	});
}

/**Delete Guard**/
function deleteGuard(msg,callback){
	mysql.query('DELETE FROM ?? WHERE ?? = ?; DELETE FROM ?? WHERE ?? = ?;',['guard','person_id',msg.guard_id,'person','person_id',msg.guard_id,],function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,message : constants.RES_MSG[200]});
		}
	});
}

/**Get guard schedule**/
function getGuardSchedule(msg,callback){
	mysql.query('SELECT ??,??,??,??,??,?? as building_name,??,??,??,?? FROM ?? as b,?? as c,?? as s WHERE ?? = ?? AND ?? = ?? AND ?? = ?',
		['s.guard_id','s.schedule_id','s.date','s.start_time','s.end_time','b.name','b.address','b.state','b.city','b.zip_code','building','contract','schedule','s.contract_id','c.contract_id','b.building_id','c.building_id','s.guard_id',msg.guard_id],function(err,response){

		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});	
		}

		});
}

/**Get guard alert**/
function getGuardAlert(msg,callback){

	mysql.query('SELECT als.*,??,??,?? FROM ?? as als,?? as s,?? as a,?? as b,?? as c WHERE ?? = ? AND ?? = ?? AND ?? = ?? AND ?? = ?? AND ?? = ??',
			['s.date','s.building_name','a.description','alert_schedule','schedule','alert','building','contract','s.guard_id',msg.guard_id,'b.building_id','c.building_id','s.contract_id','c.contract_id','s.schedule_id','als.schedule_id','als.alert_id','a.alert_id'],
			function(err,response){
			
			if (err) {
				console.log("Error while encryption");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,data : response});	
			}

			});
}

/**Get count of available guards**/
function getCountAvailableGuards(msg,callback){
	
	var value = 0;
	mysql.query('SELECT COUNT(*) as count FROM ?? WHERE ?? = ?',['guard','is_occupied',value],function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});	
		}
	});
}

/**Get count of available guards**/
function getCountGuardsForCharts(msg,callback){
	
	var value = 0;
	mysql.query('SELECT COUNT(*) as count, ??, ?? FROM ?? GROUP BY ??, ??',['bg_status','is_occupied','guard','is_occupied', 'bg_status',value],function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});	
		}
	});
}