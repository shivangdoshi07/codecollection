
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , session = require('./routes/session')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
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

router.get('/',user.signup);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
