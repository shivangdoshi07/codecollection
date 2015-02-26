/**
 * Module dependencies.
 */

var express = require('express'), multer = require('multer'), routes = require('./routes'), http = require('http'), path = require('path');
var done = false;
var app = express();
var tesseract = require('node-tesseract');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
app.use('/', router);

// development only
if ('development' == app.get('env')) {
	//app.use(express.errorHandler());
}

/* Configure the multer. */

app.use(multer({
	dest : './uploads/',
	rename : function(fieldname, filename) {
		return filename + Date.now();
	},
	onFileUploadStart : function(file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete : function(file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
		done = true;
	}
}));

router.get('/', function(req,res){
	res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
	console.log("Into post request");
	  if(done==true){
		  //ocr 
		// Recognize text of any language in any format
		  tesseract.process(req.files.path,function(err, text) {
		      if(err) {
		          console.error(err);
		      } else {
		          console.log(text);
		      }
		  });
		  
		  
	    console.log(req.files);
	    res.end("File uploaded.");
	  }
	});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
