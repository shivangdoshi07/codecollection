xxxsecurity.service('DateFormatService', function() {

	
	this.tranform_date = function(date){
			
		var dt = new Date(date);
		var day = dt.getDate(),
			yr = dt.getFullYear(),
			month = dt.getMonth()+1;
		
		var new_date = month+'-'+day+'-'+yr;
		return new_date;
	};
	
});