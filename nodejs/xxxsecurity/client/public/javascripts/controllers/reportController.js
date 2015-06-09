xxxsecurity.controller("ReportCtrl", function($scope,DataService) {
	
	$scope.initReport = function(schedule){
		console.log("in init report");
		console.log(schedule);
		$scope.schedule = schedule;
		
		$scope.building_name = schedule.building_name;
		$scope.guard_name = schedule.guard_name;
		$scope.date = schedule.date;
		$scope.time = schedule.start_time+'-'+schedule.end_time;
		
		
		var URI = urlConstants.SCHEDULE + schedule.schedule_id + "/alert";
		
		/**get alerts data for the schedule**/
		DataService.getData(URI,[]).success(function(res){
			console.log("Alert Data");
			console.log(res);
			$scope.alertData = res.data;
			var alertData  = res.data;
			
			$scope.theft = [];
			$scope.trespassing = [];
			$scope.fire = [];
			$scope.parking = [];
			alertData.forEach(function(alert){
				switch(alert.description){
					case "Theft" : 
						$scope.theft.push(alert);
						break;
						
					case "Trespassing" : 
						$scope.trespassing.push(alert);
						break;
						
					case "Fire" : 
						$scope.fire.push(alert);
						break;
						
					case "Parking" : 
						$scope.parking.push(alert);
						break;
				}
			});
		}).error(function(err){
			alert(err.message);
		});
		
		URI = urlConstants.SCHEDULE + schedule.schedule_id + "/checkpoint_log";
		/**get checkpoints data for the schedule**/
		DataService.getData(URI,[]).success(function(res){
			console.log("Checkpoint Data");
			console.log(res);
			$scope.checkpointData = res.data;
		}).error(function(err){
			alert(err.message);
		});
	};
});