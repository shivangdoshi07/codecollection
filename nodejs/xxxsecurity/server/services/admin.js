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
		
	case "getAdmin" : 
		getAdmin(message,callback);
		break;

	case "update" : 
		update(message,callback);
		break;

	case "updateGuardsByAdmin" :
		updateGuardsByAdmin(message,callback);
		break;		

	case "updateClientByAdmin" :
		updateClientByAdmin(message,callback);
		break;
		

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};


/**Add admin**/
function signup(msg,callback) {

	encryption.encryptPass(msg.password,function(err, salt, hash) {
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			/** Converting hash and salt to base64 in order to keep them in DB **/
			var email = msg.email, 
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

			/**First check whether client already exist**/
			mysql.query("SELECT * FROM ?? where ?? = ?",['person','email',email],function(err,response) {
				if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});

				} else if (response.length > 0) {
					callback({status : 400,message : constants.RES_MSG[400]});
				} else {
					/**
					 * No client found with the email id, create new user
					 */
					mysql.query("INSERT INTO ?? SET ?",['person',queryParam],function(err,response) {
						if (err) {
							console.log("Error while perfoming query !!!");
							callback({status : 500,message : constants.RES_MSG[500]});
						} else {
							callback({
								status : 200,
								data : {
									person_id : response.insertId,
									name : username,
									email : email
								}
							});
						}
					});
				}
			});
		}
	});
}

/**Update profile**/
function update(msg,callback){
	
	var queryParam = {
			address		: msg.address,
			contact_no	: msg.contact_no,
			city		: msg.city,
			state		: msg.state,
			zip_code	: msg.zip_code
	};

	mysql.query("UPDATE ?? SET ? WHERE ?? = ?",['person',queryParam,'person_id',msg.person_id],function(err,response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else{
			callback({status : 200,message : constants.RES_MSG[200]});
		}
	});
	
}

/**Update guard details**/
function updateGuardsByAdmin(msg,callback){
	var queryParam = {
		"start_date"	: req.body.start_date,
		"end_date" 		: req.body.end_date,
		"wkly_wrk_hrs" 	: req.body.wkly_wrk_hrs,
		"bg_status" 	: req.body.bg_status,
		"is_occupied" 	: req.body.is_occupied
	};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['guard',queryParam,'person_id',msg.guard_id],function(err,response){
		if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else{
					callback({status : 200,message : constants.RES_MSG[200]});
				}
	});
}

/**Update client details**/
function updateClientByAdmin(msg,callback){
	var queryParam = {
		"start_date"	: req.body.start_date,
		"end_date" 		: req.body.end_date,
		"monthly_service_charge" : req.body.monthly_service_charge,
		"balance" 		: req.body.balance
	};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['client',queryParam,'person_id',msg.client_id],function(err,response){
		if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else{
					callback({status : 200,message : constants.RES_MSG[200]});
				}
	});
}

function getAdmin(msg,callback){
	var person_id = msg.person_id;
	
	mysql.query('SELECT ??,??,CONCAT_WS(" ",??,??) as name,??,??,??,??,?? FROM ?? WHERE ??=?',
			['email','person_id','firstname','lastname','address','contact_no','city','state','zip_code','person','person_id',person_id],
			function(err,response){
				if(err){
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				}else{
					callback({status:200,data:response});
				}
	});
	
}