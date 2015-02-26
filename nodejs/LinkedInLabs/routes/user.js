
/*
 * GET users listing.
 */
exports.signup = function(req, res){
	res.render('index', function(err, html) {
		  res.send(html);
		});
};
exports.list = function(req, res){
  res.send("respond with a resource");
};	