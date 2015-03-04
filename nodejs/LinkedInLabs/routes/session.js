/*
 * This route manges users Session  - login, logout and other session related functionality
 */

var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root'
});
connection.query('USE linkedinlabs');

// --- Following is executed when user hits /api/session
module.exports = (function() {
	'user strict';
	var session = express.Router();

	// Routes
	session.post('/login',function(req,res){
		var credentials = req.body;
		connection.query('SELECT id, firstname, lastname, salt, password FROM users WHERE email = ?', credentials.email, function(err, rows) {
			if (err) {
				console.error(err);
				res.statusCode = 500;
				res.send({
					result : 'error',
					err : err.code
				});
			}else if(typeof rows[0] === 'undefined' || rows[0] === null){
				res.statusCode = 404;
				res.send({
					result : 'user does not exist',
					err : 404
				});
			}else{
				var bcrypt = require('bcryptjs');
				bcrypt.hash(credentials.password, rows[0].salt, function(err, hash) {
					if(hash === rows[0].password){
						delete rows[0].salt;
						delete rows[0].password;
						req.session.user = rows[0];
						res.send({
							result : 'login',
							user: rows[0]
						});
						res.statusCode = 200;
					}else{
						res.send({
							result : 'fail',
							hash : hash
						});
					}
				});
			}
		});
	});
	
	session.post('/logout',function(req,res){
		req.session = null;
		connection.query('UPDATE users SET timestamp = ' + Date.now() + ' WHERE id = ?', rows[0].id, function(err, row) {
			res.send({
				result : 'logout'
			});
		});
	});

	return session;
})();