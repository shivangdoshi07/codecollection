
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , calculator = require('./routes/calculator')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler')
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	  extended: true
	}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
app.use('/',router);

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler);
}

//route middleware that will happen on every request
router.use(function(req, res, next) {

    // log each request to the console
	var first = req.param("first");
	var second = req.param("second");
	if(first == "" || second == "" || typeof first === "undefined" || typeof second === "undefined")
		calculator.sendResponse("Enter atleast 2 number", res);
	if(isNaN(first))
		calculator.sendResponse(first+" is Not a Number", res);
	if(isNaN(second))
		calculator.sendResponse(second+" is Not a Number", res);
	

    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/', routes.index);
router.get('/add',calculator.add);
router.get('/substract',calculator.substract);
router.get('/multiply',calculator.multiple);
router.get('/division',calculator.division);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
