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
		connection.query('SELECT u.Id, u.Firstname, u.Lastname, u.Email,u.profilepic, u.timestamp FROM users as u', function(err, rows) {
			res.json(rows);
		});
	});
	
	//return details of specific user
	users.get('/:id', function(req, res) {
		connection.query('SELECT u.Id, u.Firstname, u.Lastname, u.Email,u.profilepic, u.timestamp FROM users as u WHERE Id='+req.params.id, function(err, rows) {
			delete rows.password;
			delete rows.salt;
			res.json(rows);
		});
	});
	
	//return meta details of specific user
	users.get('/meta/:id', function(req, res) {
		connection.query('SELECT * FROM user_meta WHERE user_id='+req.params.id, function(err, rows) {
			res.json(rows);
		});
	});
	
	//return specific meta details of specific user
	users.get('/meta/:meta_key/:id', function(req, res) {
		connection.query('SELECT * FROM user_meta WHERE `meta_key`="'+req.params.meta_key+'" AND `user_id`='+req.params.id, function(err, rows) {
			if(err){
				console.log(err);
				res.json ({
					result: 'error',
					msg: 'No information found'
				});
			}else
				res.json(rows);
		});
	});
	
	//delete specific meta details of specific user
	users.delete('/meta/:user_id/:meta_id', function(req, res) {
		connection.query('DELETE FROM user_meta WHERE `user_id` = '+req.params.user_id+' AND `id`='+req.params.meta_id, function(err, rows) {
			if(err){
				console.log(err);
				res.json ({
					result: 'error',
					msg: 'No information found'
				});
			}else
				res.json(rows);
		});
	});
	
	//update specific meta details of specific user
	users.put('/meta/:user_id/:meta_id', function(req, res) {
		var newInfo = req.body;
		newInfo.timestamp = Date.now();
		connection.query('UPDATE user_meta SET ? WHERE `user_id` '+req.params.user_id+' AND id = '+req.params.meta_id, function(err, rows) {
			if(err){
				console.log(err);
				res.json ({
					result: 'error',
					msg: 'No information found'
				});
			}else
				res.json(rows);
		});
	});
	
	//return specific meta details of specific user
	users.post('/meta/:meta_key/:id', function(req, res) {
		var info = {};
		info.user_id = req.params.id;
		info.meta_key = req.params.meta_key;
		info.meta_value = JSON.stringify(req.body);
		info.timestamp = Date.now();
		connection.query('INSERT INTO user_meta SET ? ', info, function(err, rows) {
			res.json(rows);
			console.log("Error" + err)
		});
	});
	
	//return connection detail between 2 users
	users.get('/connections/:node_1/:node_2', function(req, res) {
		connection.query('SELECT * FROM user_connections WHERE (`node_1`="'+req.params.node_1+'" AND `node_2`='+req.params.node_2+') OR (`node_1`="'+req.params.node_2+'" AND `node_2`='+req.params.node_1+')', function(err, rows) {
			if(err){
				console.log(err);
				res.json ({
					result: 'error',
					msg: 'No information found'
				});
			}else
				if(rows != null && rows != undefined && rows.length > 0){
					if(rows[0].isPending === 'false'){
						res.json({
							'isConnection' : true,
							'timestamp' : rows[0].timestamp,
							'isPending' : false
						});
					}else{
						res.json({
							'isConnection' : false,
							'timestamp' : rows[0].timestamp,
							'isPending' : true
						});
					}
					
				}else{
					res.json({
						'isConnection' : false,
						'isPending' : false
					});
				}
					
		});
	});
	
	//return connection details of a user
	users.get('/connections/:node_1', function(req, res) {
		connection.query('SELECT u.Id, u.Firstname, u.Lastname, u.Email,u.profilepic, u.timestamp as lastlogin, uc.timestamp as connectionsince FROM user_connections uc, users u WHERE (uc.node_1 = '+req.params.node_1+' OR uc.node_2 = '+req.params.node_1+') AND (uc.node_1 = u.id OR uc.node_2 = u.id) AND u.id != '+req.params.node_1+' AND isPending = "false"', function(err, rows) {
			if(err){
				console.log(err);
				res.json ({
					result: 'error',
					msg: 'No information found'
				});
			}else
				if(rows != null && rows != undefined && rows.length > 0){
						res.json({
							'connectionsFound' : true,
							'connections' : rows
						});
				}else{
					res.json({
						'connectionsFound' : false
					});
				}
					
		});
	});
	
	//create a connection between 2 users
	users.post('/connections/:node_1/:node_2',function(req,res){
		var insertData = {};
		insertData.node_1 = req.params.node_1;
		insertData.node_2 = req.params.node_2;
		insertData.isPending = 'true';
		insertData.timestamp = Date.now();
		connection.query('INSERT INTO user_connections SET ?', insertData, function(err,result){
			if(err){
				res.json({
					'result':'fail',
					'isConnection' : false,
					});
			}
			else{
				res.json({
					'result':'success',
					'isConnection' : true,
				});
			}
		});
	})
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
		    	info.profilepic = 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';
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
							user : {
								id : result.insertId,
								firstname : info.firstname,
								lastname : info.lastname,
								email : info.email
							}
						});
					}
				});
		    });
		});
	});

	return users;
})();