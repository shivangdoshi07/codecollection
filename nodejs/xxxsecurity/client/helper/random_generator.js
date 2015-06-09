/**
 * Random String Generator
 */
exports.generate = function(){
	var text = "", len = 10;
	var charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUV";
	for( var i=0; i < len; i++ )
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
};