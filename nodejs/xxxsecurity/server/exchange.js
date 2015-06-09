var amqp 		= require('amqp'),
	mysql 		= require('./helper/mysql'),
	login 		= require('./services/login'),
	client 		= require('./services/client'),
	contract	= require('./services/contract'),
	guard 		= require('./services/guard'),
	admin		= require('./services/admin'),
	building	= require('./services/building'),
	search 		= require('./services/search'),
	alert 		= require('./services/alert'),
	schedule	= require('./services/schedule'),
	checkpoint	= require('./services/checkpoint'),
	constants	= require('./helper/constants');

/** Initializing DB Connection Pool* */
mysql.createConnectionPool();

var QUEUE_NAME = constants.QUEUE_NAME;

var cnn = amqp.createConnection({host:'localhost'});

cnn.on('ready', function(){
	console.log("listening on queues");
	
	/**Login Service**/
	cnn.queue(QUEUE_NAME.LOGIN, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			login.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Client Service**/
	cnn.queue(QUEUE_NAME.CLIENT, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			client.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Contract Service**/
	cnn.queue(QUEUE_NAME.CONTRACT, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			contract.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Guard Service**/
	cnn.queue(QUEUE_NAME.GUARD, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			guard.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Admin Service**/
	cnn.queue(QUEUE_NAME.ADMIN, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			admin.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	
	/**Building Service**/
	cnn.queue(QUEUE_NAME.BUILDING, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			building.execute_request(message, function(res){

				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Report Service**/
	cnn.queue(QUEUE_NAME.REPORT, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			member.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});

	/**Search Service**/
	cnn.queue(QUEUE_NAME.SEARCH, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			search.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Alert Service**/
	cnn.queue(QUEUE_NAME.ALERT, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			alert.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Schedule Service**/
	cnn.queue(QUEUE_NAME.SCHEDULE, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			schedule.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Checkpoint Service**/
	cnn.queue(QUEUE_NAME.CHECKPOINT, function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			checkpoint.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
});

function publishQueue(conn,m,response){
	conn.publish(m.replyTo, response, {
		contentType:'application/json',
		contentEncoding:'utf-8',
		correlationId:m.correlationId
	});
}