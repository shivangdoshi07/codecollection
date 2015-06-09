var express = require('express');
var connectionpool = require('./connectionpool');
var connection = connectionpool.getConnection().connection;

module.exports = (function(){
	'use strict';
	var search = express.Router();
	search.get('/users/:q',function(req,res){
		connection.query('SELECT u.Id, u.Firstname, u.Lastname, u.Email,u.profilepic, u.timestamp as lastlogin FROM users as u WHERE CONCAT(u.Firstname, " ", u.Lastname) LIKE "%'+req.params.q+'%"', function(err, rows) {
			res.json(rows);
		});
	});
	return search;
})();