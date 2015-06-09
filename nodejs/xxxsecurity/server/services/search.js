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

	case "search" : 
		console.log("in search",message);
		var createdQuery = [];
		var retrieveParam = [];
		var searchColumns = [];

		/*search alert*/
		retrieveParam['alert'] = ['alert_schedule_id', 'description', 'building_name', 'client_name'];
		searchColumns['alert'] = ['description'];
		createdQuery['alert'] = createSQLQuery('alert_schedule',retrieveParam['alert'], searchColumns['alert'], 'alert_schedule', message.query);
		
		/*search building*/
		retrieveParam['building'] = ['building_id', 'name', 'city'];
		searchColumns['building'] = ['name', 'city'];
		createdQuery['building'] = createSQLQuery(false,retrieveParam['building'], searchColumns['building'], 'building', message.query);

		/*search client*/
		retrieveParam['client'] = ['g.client_id','p.person_id', 'p.email', 'p.firstname', 'p.lastname', 'p.role', 'g.monthly_service_charge', 'g.balance'];
		searchColumns['client'] = ['p.email', 'p.firstname', 'p.lastname'];
		createdQuery['client'] = createSQLQuery(true,retrieveParam['client'], searchColumns['client'], 'client', message.query);
			
		/*search guard*/
		retrieveParam['guard'] = ['g.guard_id','p.person_id', 'p.email', 'p.firstname', 'p.lastname', 'p.role'];
		searchColumns['guard'] = ['p.email', 'p.firstname', 'p.lastname'];
		createdQuery['guard'] = createSQLQuery(true,retrieveParam['guard'], searchColumns['guard'], 'guard', message.query);
		
		/*search report*/
		retrieveParam['report'] = ['report_id', 'schedule_id', 'description'];
		searchColumns['report'] = ['description'];
		createdQuery['report'] = createSQLQuery(false,retrieveParam['report'], searchColumns['report'], 'report', message.query);

		searchAll(createdQuery['building']+';'+createdQuery['client']+';'+createdQuery['guard'], callback);
		break;
	case "searchReport" : 
		var retrieveParam = ['report_id', 'schedule_id', 'description'];
		var searchColumns = ['description'];
		search(retrieveParam, searchColumns, 'report', message,callback);
		break;
	case "searchAlert" : 
		var retrieveParam = ['alert_id', 'description'];
		var searchColumns = ['description'];
		search(retrieveParam, searchColumns, 'alert', message,callback);
		break;
	case "searchGuard" : 
		var retrieveParam = ['g.guard_id','p.person_id', 'p.email', 'p.firstname', 'p.lastname', 'p.role'];
		var searchColumns = ['p.email', 'p.firstname', 'p.lastname'];
		searchWithStartEndDate(retrieveParam, searchColumns, 'guard', message, callback)
		break;
	case "searchClient" :
		var retrieveParam = ['g.client_id','p.person_id', 'p.email', 'p.firstname', 'p.lastname', 'p.role', 'g.monthly_service_charge', 'g.balance'];
		var searchColumns = ['p.email', 'p.firstname', 'p.lastname'];
		searchWithStartEndDate(retrieveParam, searchColumns, 'client', message, callback);
		break;
	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

/**Search**/
function search(retrieveParam, searchColumns, entityName, msg, callback){
	
	mysql.query('SELECT ?? FROM ?? WHERE CONCAT(??) LIKE ?',[retrieveParam, entityName, searchColumns, '%'+msg.query+'%'],function(err,response){
		if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else{
					callback({status : 200,message : constants.RES_MSG[200], data: response});
				}
	});
}

/* Search with start end date*/
function searchWithStartEndDate(retrieveParam, searchColumns, entityName, msg, callback){
	console.log("here");
	mysql.query('SELECT ?? FROM ?? as p JOIN ?? as g on p.person_id = g.person_id WHERE CONCAT(??) LIKE ? AND (g.start_date <= ? OR g.end_date >= ?)',[retrieveParam, 'person', entityName, searchColumns, '%'+msg.query+'%', msg.start_date, msg.end_date],function(err,response){
		if (err) {
					console.log("Error while perfoming query !!!");
					callback({status : 500,message : constants.RES_MSG[500]});
				} else{
					callback({status : 200,message : constants.RES_MSG[200], data: response});
				}
	});
}

/**Search All**/
function searchAll(query, callback){
	var res = [];
	mysql.multipleQuery(query,function(err,response){
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else{
			// `response` is an array with one element for every statement in the query: 
			response.forEach(function(element, index, array){
			  	res = res.concat(element);
		  	});
			callback({status : 200,message : constants.RES_MSG[200], data: res});
		}
	});
}

/*Create SQL Prepared statement */
function createSQLQuery(personDependent, retrieveParam, searchColumns, entityName, query){
	if(personDependent === 'alert_schedule'){
		return mysql.createSql('SELECT ?? FROM ?? as asch JOIN alert as al on asch.alert_id = al.alert_id JOIN schedule as sch on asch.schedule_id = sch.schedule_id WHERE CONCAT(??) LIKE ?',[retrieveParam, entityName, searchColumns, '%'+query+'%']);
	}else if(personDependent){
		return mysql.createSql('SELECT ?? FROM ?? as p JOIN ?? as g on p.person_id = g.person_id WHERE CONCAT(??) LIKE ?',[retrieveParam, 'person', entityName, searchColumns, '%'+query+'%']);
	}else{
		return mysql.createSql('SELECT ?? FROM ?? WHERE CONCAT(??) LIKE ?',[retrieveParam, entityName, searchColumns, '%'+query+'%']);
	}
}