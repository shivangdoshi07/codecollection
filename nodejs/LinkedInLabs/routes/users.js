var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root'
});

connection.query('USE linkedinlabs');

//--- Following is executed when user hits/api/user
module.exports = (function() {
	'use strict';
	var users = express.Router();
	
	//return details of users
	users.get('/', function(req, res) {
		console.log(req.params.id);
		connection.query('SELECT * FROM users', function(err, rows) {
			res.json(rows[0]);
		});
	});
	
	//return details of specific user
	users.get('/:id', function(req, res) {
		connection.query('SELECT * FROM users WHERE Id='+req.params.id, function(err, rows) {
			delete rows.password;
			delete rows.salt;
			res.json(rows);
		});
	});
	
	//return meta details of specific user
	users.get('/meta/:id', function(req, res) {
		connection.query('SELECT * FROM users_meta WHERE user_id='+req.params.id, function(err, rows) {
			res.json(rows);
		});
	});
	
	//return specific meta details of specific user
	users.get('/meta/:meta_key/:id', function(req, res) {
		connection.query('SELECT * FROM users_meta WHERE meta_key='+req.params.meta_key+' AND user_id='+req.params.id, function(err, rows) {
			res.json(rows);
		});
	});

	//save new user info in database
	users.post('/', function(req, res) {
		var bcrypt = require('bcryptjs');
		var info = req.body;
		bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(info.password, salt, function(err, hash) {
		        // Store hash in your password DB.
		    	info.password = hash;
		    	info.salt = salt;
		    	info.timestamp = Date.now();
		    	connection.query('INSERT INTO users SET ?', info, function(err, result) {
					if (err) {
						console.error(err);
						res.statusCode = 500;
						res.send({
							result : 'error',
							err : err.code
						});
					} else {
						res.send({
							result : 'success',
							err : '',
							id : result.insertId
						});
					}
				});
		    });
		});
	});

	return users;
})();