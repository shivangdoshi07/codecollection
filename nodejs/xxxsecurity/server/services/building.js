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

	case "getAllBuildings" : 
		getAllBuildings(message,callback);
		break;

	case "getBuilding" : 
		getBuilding(message,callback);
		break;

	case "addBuilding" : 
		addBuilding(message,callback);
		break;

	case "updateBuilding" : 
		updateBuilding(message,callback);
		break;

	case "deleteBuilding" : 
		deleteBuilding(message,callback);
		break;

	case "getAllCheckpoints" : 
		getAllCheckpoints(message,callback);
		break;

	case "getCheckpoint" : 
		getCheckpoint(message,callback);
		break;

	case "addCheckpoint" : 
		addCheckpoint(message,callback);
		break;

	case "updateCheckpoint" : 
		updateCheckpoint(message,callback);
		break;

	case "deleteCheckpoint" : 
		deleteCheckpoint(message,callback);
		break;

	case "getBuildingGuards" : 
		getBuildingGuards(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**Get all buildings**/
function getAllBuildings(msg,callback){
	
	mysql.query('SELECT b.*,CONCAT_WS(" ",??,??) as client_name FROM ?? as p,?? as b,?? as c WHERE ?? = ?? AND ?? = ??',
			['p.firstname','p.lastname','person','building','client','b.client_id','c.person_id','c.person_id','p.person_id'],
			function(err,response){
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

/**Get building**/
function getBuilding(msg,callback){
	mysql.query('SELECT b.*,CONCAT_WS(" ",??,??) as client_name FROM ?? as b,?? as p WHERE ?? = ?? AND ?? = ?', ['p.firstname', 'p.lastname', 'building', 'person', 'b.client_id', 'p.person_id', 'b.building_id', msg.building_id], function(err, response) {
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

/**Add building**/
function addBuilding(msg,callback){

	mysql.query('SELECT * FROM ?? WHERE ?? = ? AND ?? = ?',['building','name',msg.name,'zip_code',msg.zip_code],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else if(response.length>0){
			//Check whether the building name and zip code already exist
			callback({
				status : 401,
				message : "Building Already Exist !!"
			});
		}else{
			var queryParam = {
					name : msg.name,
					address : msg.address,
					state : msg.state,
					city : msg.city,
					zip_code : msg.zip_code,
					client_id : msg.client_id,
					status : 'active'
			};
			mysql.query('INSERT INTO ?? SET ?',['building',queryParam],function(err,response){
				if(err){
					console.log("Error while perfoming query !!!");
					callback({
						status : 500,
						message : constants.RES_MSG[500]
					});
				}else{

					var building_id = response.insertId;
					var params = [];
					msg.checkpoints.forEach(function(checkpoint){
						params.push([building_id,checkpoint.checkpoint_name,checkpoint.lat + ',' + checkpoint.long]);
					});

					mysql.query('INSERT INTO ?? (??,??,??) VALUES ?',['checkpoint','building_id','checkpoint_name','coords',params],function(err,response){
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
			});
		}

	});
}

/**Update building**/
function updateBuilding(msg,callback){
	var queryParam = {
			name : msg.name,
			address : msg.address,
			state : msg.state,
			city : msg.city,
			zip_code : msg.zip_code,
			client_id : msg.client_id,
			service_fees : msg.service_fees,
			status : msg.status
	};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['building',queryParam,'building_id',msg.building_id],function(err,response){
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
function deleteBuilding(msg,callback){

mysql.query('SELECT * FROM ?? WHERE ?? = ? AND ?? = ?',['contract','building_id',msg.building_id,'status','active'],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else{
			//contract active
			if(response.length > 0){
				callback({
				status : 403,
				message : "Contract is active for the building. Cannot Delete !!"
			});		
			}else{

				mysql.query("DELETE FROM ?? WHERE ?? = ?",['building','building_id',msg.building_id],function(err,response){
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

		}

	});
}

/**Get all building checkpoints**/
function getAllCheckpoints(msg,callback){
	mysql.query('SELECT * FROM ?? WHERE ?? = ?',['checkpoint','building_id',msg.building_id],function(err,response){
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

/**Get the checkpoint**/
function getCheckpoint(msg,callback){
	mysql.query('SELECT * FROM ?? WHERE ?? = ?',['checkpoint','checkpoint_id',msg.checkpoint_id],function(err,response){
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

/**Add a checkpoint**/
function addCheckpoint(msg,callback){

	mysql.query('SELECT * FROM ?? WHERE ?? = ? AND ?? = ?',['checkpoint','building_id',msg.building_id,'coords',msg.coords],function(err,response){
		if(err){
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : constants.RES_MSG[500]
			});
		}else if(response.length>0){
			callback({
				status : 401,
				message : constants.RES_MSG[401]
			});
		}else{
			var queryParam = {
					checkpoint_name : msg.checkpoint_name,
					building_id : msg.building_id,
					coords : msg.coords
			};
			mysql.query('INSERT INTO ?? SET ?',['checkpoint',queryParam],function(err,response){
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
							checkpoint_id : response.insertId,
							building_id : msg.building_id,
							checkpoint_name : msg.checkpoint_name,
							coords : msg.coords
						}
					});
				}
			});
		}
	});
}

/**Update checkpoint**/
function updateCheckpoint(msg,callback){
	var queryParam = {
			checkpoint_name : msg.checkpoint_name,
			building_id : msg.building_id,
			coords : msg.coords
	};

	mysql.query('UPDATE ?? SET ? WHERE ?? = ?',['checkpoint',queryParam,'checkpoint_id',msg.checkpoint_id],function(err,response){
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

/**Delete checkpoint**/
function deleteCheckpoint(msg,callback){
	mysql.query("DELETE FROM ?? WHERE ?? = ?",['checkpoint','checkpoint_id',msg.checkpoint_id],function(err,response){
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

/**get guards of the building**/
function getBuildingGuards(msg,callback){
	mysql.query('SELECT CONCAT_WS(" ",??,??) as guard_name,?? FROM person as p,guard as g where ?? = ?? AND ?? IN (SELECT ?? FROM ?? as s WHERE ?? IN (select ?? from contract where ?? = ?))',
		['p.firstname','p.lastname','p.person_id','g.person_id','p.person_id','g.person_id','s.guard_id','schedule','contract_id','contract_id','building_id',msg.building_id],
		function(err,response){
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