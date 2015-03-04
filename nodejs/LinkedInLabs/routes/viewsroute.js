var express = require('express');

module.exports = (function() {
	'use strict';
	var viewsRoute = express.Router();
	
	viewsRoute.get('/login', function(req, res) {
		res.render('templates/login');
		});
	viewsRoute.get('/home', function(req, res) {
		res.render('templates/home');
		});
	
	viewsRoute.get('/', function(req, res) {
		res.render('index');
	});

	return viewsRoute;
})();