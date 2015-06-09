var express = require('express'),
	constants = require('../helper/constants'),
	redis = require('redis');

var redis_client = redis.createClient();

var viewsRoute = express.Router();

viewsRoute.get(['/','/home'], function(req, res) {
	res.render('index');
});

viewsRoute.get('/partials/login', function(req, res) {
	res.render('partials/login');
});

viewsRoute.get('/partials/home', function(req, res) {
	var token = req.headers.authorization;
	redis_client.hgetall(token,function(err,data){
		if(err){
			res.render('partials/login');
		}else{
			if(data){
				if(Number(data.role) === Number(constants.ROLE.ADMIN)){
					res.render('partials/admin');
				}else if(Number(data.role) === Number(constants.ROLE.CLIENT) || Number(data.role) === Number(constants.ROLE.GUARD)){
					res.render('partials/home');
				}else{
					res.render('partials/login');
				}
			}else{
				res.render('partials/login');
			}
		} 
	});
});

module.exports = (function() {
	'use strict';
	return viewsRoute;
})();