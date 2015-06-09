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

	case "signin" : 
		signin(message,callback);
		break;

	case "signout" :
		signout(message,callback);
		break;

	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};


/**
 * Signin
 */
function signin(msg,callback){
	var data = mysql.query("select * from person where ?? = ?",['email',msg.email],function(err,response){
		if(err){
			console.log(err);
			callback({status : 500,message : constants.RES_MSG[500]});
		}else{
			if(response.length>0){

				var inputPassword = msg.password,
				email = response[0].email,
				password = response[0].password,
				salt = response[0].salt,
				saltBuf = new Buffer(salt,'base64'),
				userName = response[0].firstname + " " + response[0].lastname,
				person_id = response[0].person_id,
				role = response[0].role;

				/**
				 * In order to compare input and db password salt has to be
				 * converted back into binary since hash was created using that
				 * binary only*
				 */
				encryption.encryptPass(inputPassword,saltBuf,function(err,hash){
					/**
					 * Calculated binary hash has to be converted into base64
					 * since the password stored in the vault is in base64
					 * format*
					 */
					if(hash.toString("base64") === password){
						callback({
							status : 200,
							data : {
								email : email,
								name : userName,
								person_id : person_id,
								role : role
							}
						});
					}else{
						callback({status:401,message : constants.RES_MSG[401]});
					}
				});
			}else{
				callback({status : 401,message : constants.RES_MSG[401]});
			}
		}
	});
}