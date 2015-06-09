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

	case "getClient" : 
		getClient(message,callback);
		break;

	case "getAllClients" : 
		getAllClients(message,callback);
		break;

	case "updateClient" : 
		updateClient(message,callback);
		break;

	case "deleteClient" : 
		deleteClient(message,callback);
		break;
		
	case "getClientContracts" : 
		getClientContracts(message,callback);
		break;
		
	case "getClientBuildings" : 
		getClientBuildings(message,callback);
		break;
		
	case "getClientAlerts" : 
		getClientAlerts(message,callback);
		break;
	case "getClientAlertsForCharts" : 
		getClientAlertsForCharts(message,callback);
		break;
		
	case "getClientSchedules" : 
		getClientSchedules(message,callback);
		break;
	
	case "getClientSchedulesForReport" : 
		getClientSchedulesForReport(message,callback);
		break;

	case "createNewBill" : 
		createNewBill(message,callback);
		break;
	case "getAllBill" : 
		getAllBill(message,callback);
		break;
	case "getBalance" :
		getBalance(message,callback);
		break;

	default :
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};


/**
 * Add client
 */
function signup(msg,callback) {

	encryption.encryptPass(msg.password,function(err, salt, hash) {
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			/** Converting hash and salt to base64 in order to keep them in DB **/
			var email = msg.email,
				client_id = msg.client_id,
				username = msg.firstname + " " + msg.lastname,
				role = msg.role;

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
					role		: role
			};
			
			/**First check whether client already exist**/
			mysql.query("SELECT * FROM ?? as ?? JOIN ?? as ?? on ?? = ?? where ?? = ? OR ?? = ?",['person', 'p', 'client', 'c' ,'p.person_id' ,'c.person_id' ,'email',email, 'client_id', client_id],function(err,response) {
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
							/**
							 * Inserting client data into client table with person_id
							 */
							var person_id = response.insertId;
							queryParam = {
								"client_id"	: client_id,
								"person_id" : person_id,
								"start_date" : msg.start_date,
								"end_date" : msg.start_date
							};
							mysql.query("INSERT INTO ?? SET ?",['client',queryParam],function(err,response) {
								if (err) {
									console.log("Error while perfoming query !!!");
									callback({status : 500,message : constants.RES_MSG[500]});
								} else {
									callback({
										status : 200,
										data : {
											person_id : person_id,
											client_id : client_id,
											email : email,
											name : username,
											role : role
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

/**Get client**/
function getClient(msg,callback){

	mysql.query('SELECT ??,??,??,CONCAT_WS(" ",??,??) as client_name,??,??,??,??,??,??,??,??,?? FROM ?? as p,?? as c WHERE ?? = ?? AND ?? = ?',
		['c.client_id','p.person_id','p.email','p.firstname','p.lastname','p.address','p.city','p.state','p.zip_code','p.contact_no','c.start_date','c.end_date','c.monthly_service_charge','c.balance','person','client','c.person_id','p.person_id','c.person_id',msg.client_id],
		function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});								
		}
	});

}

/**Get all clients**/
function getAllClients(msg,callback){
	mysql.query('SELECT ??,??,??,??,??,??,??,??,??,??,??,??,?? FROM ?? as p,?? as c WHERE ?? = ??',
		['c.client_id','p.person_id','p.email','p.firstname','p.lastname','p.address','p.city','p.state','p.zip_code','c.start_date','c.end_date','c.monthly_service_charge','c.balance','person','client','c.person_id','p.person_id'],
		function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});								
		}
	});
}

/**Update client**/
function updateClient(msg,callback){
	
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

/**Delete client**/
function deleteClient(msg,callback){
	mysql.query('DELETE FROM ?? WHERE ?? = ?',['client','person_id',msg.client_id],function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,message : constants.RES_MSG[200]});
		}
	});
}

/**Get all contracts of a client**/
function getClientContracts(msg,callback){
	
	var client_id = msg.client_id;
	
	mysql.query('SELECT c.*,??,??,??,??,?? FROM ?? as c,?? as b WHERE ?? = ?? AND ?? = ?',
			['b.name','b.address','b.city','b.state','b.zip_code','contract','building','c.building_id','b.building_id','b.client_id',client_id],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}

/**Get all Buildings of a client**/
function getClientBuildings(msg,callback){
var client_id = msg.client_id;
	
	mysql.query('SELECT * FROM ?? WHERE ?? = ?',
			['building','client_id',client_id],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}

/**Get all alerts of a client**/
function getClientAlerts(msg,callback){
	var client_id = msg.client_id;
	
	mysql.query('SELECT als.*,??,??,??,?? FROM ?? as als,?? as s,?? as a,?? as b,?? as c WHERE ?? = ? AND ?? = ?? AND ?? = ?? AND ?? = ?? AND ?? = ??',
			['s.date','s.guard_name','s.building_name','a.description','alert_schedule','schedule','alert','building','contract','b.client_id',client_id,'b.building_id','c.building_id','s.contract_id','c.contract_id','s.schedule_id','als.schedule_id','als.alert_id','a.alert_id'],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}

/**Get all alerts of a client**/
function getClientAlertsForCharts(msg,callback){
	var client_id = msg.client_id;
	
	mysql.query('SELECT COUNT(*) as count, als.*,??,??,??,?? FROM ?? as als,?? as s,?? as a,?? as b,?? as c WHERE ?? = ? AND ?? = ?? AND ?? = ?? AND ?? = ?? AND ?? = ?? GROUP BY ??',
			['s.date','s.guard_name','s.building_name','a.description','alert_schedule','schedule','alert','building','contract','b.client_id',client_id,'b.building_id','c.building_id','s.contract_id','c.contract_id','s.schedule_id','als.schedule_id','als.alert_id','a.alert_id','s.date'],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}

/**Get all schedules of a client**/
function getClientSchedules(msg,callback){
	var client_id = msg.client_id;
	
	mysql.query('SELECT s.* FROM ?? as s,?? as b,?? as c WHERE ?? = ? AND ?? = ?? AND ?? = ??',
			['schedule','building','contract','b.client_id',client_id,'c.building_id','b.building_id','s.contract_id','c.contract_id'],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});	
}

function getClientSchedulesForReport(msg,callback){
var client_id = msg.client_id;
	
	mysql.query('SELECT s.* FROM ?? as s,?? as b,?? as c WHERE ?? = ? AND ?? = ?? AND ?? = ?? AND date_format(str_to_date(??,"%m-%d-%Y"),"%Y-%m-%d") < curdate()',
			['schedule','building','contract','b.client_id',client_id,'c.building_id','b.building_id','s.contract_id','c.contract_id','s.date'],
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}

function createNewBill(msg,callback){
	var client_id = msg.client_id;
	var getAllContractQuery = mysql.createSql('SELECT c.*,?? FROM ?? as c,?? as b WHERE ?? = ?? AND ?? = ?',
							  ['b.service_fees','contract','building','c.building_id','b.building_id','b.client_id',client_id]);
	var getLatestBillQuery = mysql.createSql('SELECT * FROM ?? WHERE ?? = ? ORDER BY id DESC LIMIT 1',
							 ['bill','client_id',client_id]);
	mysql.multipleQuery( getLatestBillQuery + ';' + getAllContractQuery,
			function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {

			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var bill = response[0][0];
			var contracts = response[1];
			var res = {};	
			var today = new Date();
			var paymentDate = new Date(today.getTime() + (86400000 * 10)); //payment in days
			if(bill != null){
				var billAmount = 0;
				contracts.forEach(function(element, index, array){
				  	var lastBillDate = new Date( bill.created_on.replace( /(\d{2})-(\d{2})-(\d{4})/, "$1/$2/$3") );
					var numberOfDays = Math.round(Math.abs((lastBillDate.getTime() - today.getTime())/(oneDay)));
					if(numberOfDays > 1){
						billAmount += (element.service_fees/30)*numberOfDays;
						billAmount += element.no_of_guards * constants.SALARY['GUARD']; //8 hours per day
					}
			  	});
			}else{
				var billAmount = 0;
				contracts.forEach(function(element, index, array){
				  	var lastBillDate = new Date( element.start_date.replace( /(\d{2})-(\d{2})-(\d{4})/, "$1/$2/$3") );
					var numberOfDays = Math.round(Math.abs((lastBillDate.getTime() - today.getTime())/(oneDay)));
					
					if(numberOfDays > 1){
						billAmount += (element.service_fees/30)*numberOfDays;
						billAmount += element.no_of_guards * constants.SALARY['GUARD']; //8 hours per day
					}
			  	});
			}
			billAmount = Math.ceil(billAmount * 100) / 100;
			if(billAmount > 0){
					res = {
					created_on 	: (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear(),
					payment_on	: (paymentDate.getMonth()+1)+'-'+paymentDate.getDate()+'-'+paymentDate.getFullYear(),
					amount 		: billAmount,
					client_id	: client_id,
					status		: 'unpaid'
				}
				mysql.query("INSERT INTO ?? SET ?",['bill',res],function(err,response) {
					if (err) {
						console.log("Error while perfoming query !!!");
						callback({status : 500,message : constants.RES_MSG[500]});
					} else {
						callback({status : 200,data : res});
					}
				});
			}else{
				res = {
					client_id	: client_id,
					status 	: 'no dues'
				}
				callback({status : 200,data : res});
			}
		}
	});
}

/**Get all schedules of a client**/
function getAllBill(msg,callback){
	var client_id = msg.client_id;
	mysql.query('SELECT * FROM ?? WHERE ?? = ?',['bill','client_id',client_id],function(err,response){
		if (err) {
			console.log("Error while encryption");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});	
}



/**Get Balance of a client**/
function getBalance(msg,callback){
	var client_id = msg.client_id;
	mysql.query('SELECT SUM(??) as balance FROM ?? WHERE ?? = ? AND ?? = ?',['amount','bill','client_id',client_id, 'status','unpaid'],function(err,response){
		if (err) {
			console.log("Error while perfoming getBalance query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {
			callback({status : 200,data : response});
		}
	});
}
