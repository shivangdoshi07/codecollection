//--- Following is executed when user hits /api/signin
var	mq_client = require('../rpc/client'),
	constants = require('../helper/constants'),
	redis = require('redis'),
	random_generator = require('../helper/random_generator'),
	methods = require('../helper/methods');

var redis_client = redis.createClient();

var QUEUE_NAME = constants.QUEUE_NAME;

module.exports = function(req,res){
	
	if(!req.body.email || !req.body.password){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		var email = req.body.email;
		var msg_payload = {
			operation : "signin",
			message : {
				email : email,
				password : req.body.password
			}
		};
		
		mq_client.make_request(QUEUE_NAME.LOGIN,msg_payload, function(err,results){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				var key = random_generator.generate();
				var role = Number(results.data.role);
				redis_client.hmset(key,{
					'person_id' : results.data.person_id,
					'role' : role
				},function(err,reply){
					if(err){
						res.status(500).json({
							status : 500,
							message : constants.RES_MSG[500]
						});
					}else{
						/*redis_client.expire(key, constants.REDIS_EXP_TIME);*/
						var role_name = methods.getKeyByValue(constants.ROLE,role);
						res.status(results.status).json({
							data : results.data,
							status : results.status,
							token : key,
							role :  role_name
						});
					}
				});
			}  
		});
	}
};