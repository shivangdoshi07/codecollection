var ejs = require("ejs");
//var mysql = require("./mysql");
var number1, number2;
function add(req,res) {
	var sum = Number(req.param("first")) + Number(req.param("second"));
	sendResponse(sum,res);	
}

function substract(req,res){
	var difference = Number(req.param("first")) - Number(req.param("second"));
	sendResponse(difference,res);
}

function multiple(req,res){
	var multiple = Number(req.param("first")) * Number(req.param("second"));
	sendResponse(multiple,res);
}

function division(req,res){
	if(req.param("second") <= 0)
		sendResponse("Denominator cannot be zero",res);
	else{
		var div = Number(req.param("first")) / Number(req.param("second"));
		sendResponse(div,res);
	}
}

function sendResponse(ans,res){
	res.json({result:ans});
}



exports.add = add;
exports.substract = substract;
exports.multiple = multiple;
exports.division = division;
exports.sendResponse = sendResponse;