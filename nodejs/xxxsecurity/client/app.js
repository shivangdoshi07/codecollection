// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

	// Count the machine's CPUs
	var cpuCount = require('os').cpus().length;

	// Create a worker for each CPU
	for (var i = 0; i < cpuCount; i += 1) {
			cluster.fork();
	}

// Code to run if we're in a worker process
}
else {

		var express = require('express'),
		path = require('path'),
		favicon = require('serve-favicon'),
		logger = require('morgan'),
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		redis = require('redis'),
		constants = require('./helper/constants');

		var redis_client = redis.createClient();

		var viewRoute = require('./routes/view'),
		apiRoute = require('./routes/api');

		var app = express();

		//view engine setup
		app.set('views', __dirname + '/views');
		app.use(express.static(__dirname + '/public'));
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');

		//uncomment after placing your favicon in /public
		app.use(favicon(__dirname + '/public/images/favicon.ico'));
		app.use(logger('dev'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(multer());
		app.use(express.static(path.join(__dirname, 'public')));


		app.use(function(req,res,next){
			if(req.headers.authorization){
				var token = req.headers.authorization;
				redis_client.hgetall(token,function(err,data){
					if(err){
						res.status(403).json({status:403,message : constants.RES_MSG[403]});
					}else{
						if(data){
							next();
						}else{
							/*res.render(403).json({status:403,message : constants.RES_MSG[403]});*/
							console.log("err 45");
							res.render("error");
						}
					}
				});
			}else{
				if(req.url === "/" || req.url === "/api/signin" || req.url === "/partials/login" || req.url === "/home" || req.url === "/api/validate_token"){
					next();
				}else if(req.url === "/api/client/" && req.method==="POST"){
						next();
					}else{
						console.log("err 56");
						res.render("error");
					}
			}
		});


		app.post('/api/validate_token',function(req,res){

			if(!req.body.token){
				res.status(400).json({status:400,message : constants.RES_MSG[400]});
			}else{
				var token = req.body.token;
				redis_client.hgetall(token,function(err,data){
					if(err){
						res.status(403).json({status:403,message : constants.RES_MSG[403]});
					}else{
						if(data){
							res.status(200).json({status:200,message : constants.RES_MSG[200]});
						}else{
							res.status(403).json({status:403,message : constants.RES_MSG[403]});
						}
					}
				});
			}

		});


		app.use('/',viewRoute);
		app.use('/api',apiRoute);


		//catch 404 and forward to error handler
		app.use(function(req, res, next) {
			console.log("err 91");
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

		//error handlers

		//development error handler
		//will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function(err, req, res, next) {
				console.log("err 103");
				res.status(err.status || 500);
				res.render('error');
			});
		}

		//production error handler
		//no stack traces leaked to user
		app.use(function(err, req, res, next) {
			console.log("err 112");
			res.status(err.status || 500);
			res.json({
				message: err.message,
				error: {}
			});
		});

		app.listen(3000,function(){
			console.log("Client Started ... ");
		});

		module.exports = app;

}


cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

});
