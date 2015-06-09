//--- Following is executed when user hits /api/search
var express = require('express'),
	mq_client = require('../rpc/client'),
	constants = require('../helper/constants'),
	methods = require('../helper/methods');

var search = express.Router();
var QUEUE_NAME = constants.QUEUE_NAME;

search.get('/', function(req, res) {
	if(!req.query.query){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "search",
				message : {
					"query"	: req.query.query
				}
		};

		mq_client.make_request(QUEUE_NAME.SEARCH,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});
	}
});

/* Search Guard*/
search.get('/guard', function(req, res) {
	if(!req.query.query){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "searchGuard",
				message : {
					"query"	: req.query.query,
					"start_date": req.query.start_date,
					"end_date": req.query.end_date
				}
		};

		mq_client.make_request(QUEUE_NAME.SEARCH,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});
	}
});

/* Search Client*/
search.get('/client', function(req, res) {
	if(!req.query.query){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "searchClient",
				message : {
					"query"	: req.query.query,
					"start_date": req.query.start_date,
					"end_date": req.query.end_date
				}
		};

		mq_client.make_request(QUEUE_NAME.SEARCH,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});
	}
});

/* Search Report*/
search.get('/report', function(req, res) {
	if(!req.query.query){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "searchReport",
				message : {
					"query"	: req.query.query
				}
		};

		mq_client.make_request(QUEUE_NAME.SEARCH,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});
	}
});

/* Search Alert*/
search.get('/alert', function(req, res) {
	if(!req.query.query){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var msg_payload = {
				operation : "searchAlert",
				message : {
					"query"	: req.query.query
				}
		};

		mq_client.make_request(QUEUE_NAME.SEARCH,msg_payload, function(err,result){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(result.status).json(result);
			}
		});
	}
});

module.exports = (function() {
	'use strict';	
	return search;
})();