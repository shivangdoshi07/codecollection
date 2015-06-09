var express = require('express');
var users = require('./users');
var session = require('./session');
var search = require('./search');

module.exports = (function() {
	'use strict';
	var api = express.Router();
	
	
	api.use(function(req,res,next){
		console.log(req.url);
		next();
	});
	
	//Route to different APIs
	api.use('/user', users);
	api.use('/session',session);
	api.use('/search',search);
	api.use('/random',function(req,res){
		console.log(req.body);
	});
	
	return api;
})();