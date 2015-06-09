var mysql = require('mysql');
var connectionGlobals = {
		host : 'localhost',
		user : 'root',
		password : 'root'
	}
var connPool = [];
var usedConnectionsBucket = [];
var freeConnectionsBucket = [];
init();
function init(){
	for (var i = 0; i < 20; i++){
		connPool[i] = mysql.createConnection(connectionGlobals);

		connPool[i].connect();
		
		connPool[i].query('USE linkedinlabs');
		freeConnectionsBucket.push(i);
	}
}

function removeByValue(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

exports.getConnection = function(){
	if(freeConnectionsBucket.length > 0){
		var connectionId = freeConnectionsBucket.pop();
		usedConnectionsBucket.push(connectionId);
		var connection = {'connection': connPool[connectionId], 'poolId':connectionId};
		console.log('Inside Get Connection',usedConnectionsBucket,freeConnectionsBucket);
		return connection;
	}	
};

exports.releaseConnection = function(threadid){
	removeByValue(usedConnectionsBucket, threadid);
	freeConnectionsBucket.push(threadid);
	console.log('Inside Release Connection',usedConnectionsBucket,freeConnectionsBucket);
};