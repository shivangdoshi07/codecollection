
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , viewsRoute = require('./routes/viewsroute')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var app = express();
var session = require('express-session')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));

//configure session 
app.use(session({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: true,
	  cookie: {maxAge: 60000}
	}));

//create application/json parser 
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
app.use(express.static(path.join(__dirname, 'public')));

//check if user session is set else redirect to login
app.use(function(req,res,next){
	console.log("Requesting URL " + req.url);
	
	next();
});

/*========Define routes=======*/
app.use('/',viewsRoute);


app.use('/api',jsonParser,api);



// development only
if ('development' == app.get('env')) {
  app.use(errorhandler);
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
