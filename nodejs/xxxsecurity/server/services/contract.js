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

	case "getAllContractByClient" : 
		getAllContractByClient(message,callback);
		break;
		
	case "getAllContractByAdmin" : 
		getAllContractByAdmin(message,callback);
		break;
		
	case "getContract" : 
		getContract(message,callback);
		break;
		
	case "addContract" : 
		addContract(message,callback);
		break;
		
	case "deleteContractByAdmin" : 
		deleteContractByAdmin(message,callback);
		break;
		
	case "deleteContractByClient" : 
		deleteContractByClient(message,callback);
		break;
		
	case "getContractRequests" : 
		getContractRequests(message,callback);
		break;
		
	case "updateContractByAdmin" : 
		updateContractByAdmin(message,callback);
		break;
	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/*
 * Get all the Contracts for particular client
 */
function getAllContractByClient(msg,callback){
	mysql.query('SELECT * FROM ?? WHERE client_id = ?',	['contract',msg.client_id],
			function(err,response){
			if (err) {
				console.log("Error while perfoming query !!!");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,data : response});								
			}
		});
}


/*
 * Get all the Contracts 
 */
function getAllContractByAdmin(msg,callback){
	
	mysql.query('SELECT ct.*,?? as building_name,CONCAT_WS(" ",??,??) as client_name FROM ?? as ct,?? as b,?? as c,?? as p WHERE ?? = ?? AND ?? = ?? AND ?? = ??',
	['b.name','p.firstname','p.lastname','contract','building','client','person','ct.building_id','b.building_id','b.client_id','c.person_id','c.person_id','p.person_id'],
			function(err,response){
			if (err) {
				console.log("Error while perfoming query !!!");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,data : response});								
			}
		});
}

/*
 * Get a contract
 */
function getContract(msg,callback){
	mysql.query('SELECT c.*,??,??,??,??,??,CONCAT_WS(" ",??,??) as client_name,?? FROM ?? as c,?? as b,?? as p WHERE ?? = ?? AND ?? = ?? AND ?? = ?', ['b.name', 'b.address', 'b.city', 'b.state', 'b.zip_code', 'p.firstname', 'p.lastname', 'b.client_id', 'contract', 'building', 'person', 'c.building_id', 'b.building_id', 'b.client_id', 'p.person_id', 'c.contract_id', msg.contract_id],
			function(err,response){
			if (err) {
				console.log("Error while perfoming query !!!");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,data : response});								
			}
		});
}


/*
 * Add new contract
 */
function addContract(msg,callback){
	/**First check whether contract already exist**/
	var queryParam = msg;
	var building_id = msg.building_id;
	mysql.query("SELECT ?? FROM ?? WHERE ?? = ? AND ?? IN (?,?)",['contract_id','contract','building_id',building_id,'status','active','request'],function(err,response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});

		} else if (response.length > 0) {
			callback({status : 400,message : "Contract Exist Or Request Pending !"});
		} else {
			/**
			 * No contract found with the building id, create new contract
			 */
			mysql.query("INSERT INTO ?? SET ?",['contract',queryParam],function(err,response) {
				if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else {
					callback({status : 200,message : constants.RES_MSG[200]});
				}
			});
		}
	});
}

/**
 * Delete the Contract by admin
 */
function deleteContractByAdmin(msg,callback){
	mysql.query('DELETE FROM ?? WHERE ?? = ?',	['contract','contract_id',msg.contract_id],
			function(err,response){
			if (err) {
				console.log("Error while perfoming query !!!");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,message : constants.RES_MSG[200]});								
			}
		});
}

/**
 * Reject request of contract by client 
 */
function deleteContractByClient(msg,callback){
	mysql.query('UPDATE ?? SET ?? = ? WHERE ?? = ?',['contract','status','inactive','contract_id',msg.contract_id],
			function(err,response){
			if (err) {
				console.log("Error while perfoming query !!!");
				callback({status : 500,message : constants.RES_MSG[500]});
			} else {
				callback({status : 200,message : constants.RES_MSG[200]});								
			}
		});
}


/**get all contract requests**/
function getContractRequests(msg,callback){
	mysql.query('SELECT ct.*,?? as building_name,??,??,??,??,CONCAT_WS(" ",??,??) as client_name,??,?? FROM ?? as ct,?? as b,?? as c,?? as p WHERE ?? = ?? AND ?? = ?? AND ?? = ?? AND ?? = ?',
			['b.name','b.address','b.city','b.state','b.zip_code','p.firstname','p.lastname','p.email','p.contact_no','contract','building','client','person','ct.building_id','b.building_id','b.client_id','c.person_id','c.person_id','p.person_id','ct.status','request'],
					function(err,response){
					if (err) {
						console.log("Error while perfoming query !!!");
						callback({status : 500,message : constants.RES_MSG[500]});
					} else {
						callback({status : 200,data : response});								
					}
				});
}

/**accept/update contract by admin**/
function updateContractByAdmin(msg,callback){
	var contract_id = msg.contract_id;
	var building_id = msg.building_id;
	var params = {
			'no_of_guards' : msg.no_of_guards,
			'status' : msg.status
	};
	
	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['contract',params,'contract_id',contract_id],function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else {

			var getAvaiableGuards = mysql.createSql("SELECT CONCAT_WS(' ',??,??) as ??, ?? FROM ?? JOIN ?? as p ON p.person_id = ?? WHERE ?? = ? AND ?? = ? LIMIT "+msg.no_of_guards,
					 ['firstname','lastname', 'guard_name', 'guard_id', 'guard', 'person', 'guard_id','is_occupied', 0, 'bg_status','verified']);

			var getBuildingClientNames = mysql.createSql("SELECT CONCAT_WS(' ',??,??) as ??, ?? FROM ?? JOIN ?? ON ?? = ?? WHERE ?? = ? ",
					 ['firstname','lastname', 'client_name', 'name','building', 'person', 'client_id', 'person_id', 'building_id', building_id]);	
			
			console.log(getAvaiableGuards);
			mysql.multipleQuery(getAvaiableGuards+';'+getBuildingClientNames,function(err,response){
				if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else{
					// `response` is an array with one element for every statement in the query: 
					var guards = response[0];
					var names = response[1][0]; // building and client name
					var queries = [];
					if(guards.length >= msg.no_of_guards){
						guards.forEach(function(element, index, array){
							var scheduleQueryParam = {
								start_time		: constants.SCHEDULE["MORNING"]["START"],
								end_time		: constants.SCHEDULE["MORNING"]["END"],
								date 			: msg.start_date,
								guard_id		: element.guard_id,
								contract_id		: contract_id,
								guard_name		: element.guard_name,
								client_name		: names['client_name'],
								building_name	: names['name']
							};
						 	queries.push(
						 		mysql.createSql("INSERT INTO ?? SET ?",['schedule',scheduleQueryParam])
						 	);
						 	queries.push(
						 		mysql.createSql("UPDATE ?? SET ?? = ? WHERE ?? = ?",['guard','is_occupied',1,'guard_id',element.guard_id])
						 	);
					  	});
				  	
						mysql.multipleQuery(queries.join(';'),function(err,response){
							if (err) {
								console.log("Error while perfoming query !!!");
								callback({status : 500,message : constants.RES_MSG[500]});
							} else{
								callback({status : 200,message : constants.RES_MSG[200]});
							}
						});
					}else{
						callback({status : 200,message : "Not enough guard"});
					}
				}
			});
			//callback({status : 200,message : constants.RES_MSG[200]});								
		}
	});
}