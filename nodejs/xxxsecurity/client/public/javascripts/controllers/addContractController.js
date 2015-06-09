xxxsecurity.controller("AddContractCtrl", function($scope, $modalInstance,DataService,$window,DateFormatService) {

	
	$scope.getClientInit = function(){
		
		$scope.selectedStartDate = new Date();
		$scope.minDate = new Date();
		$scope.selectedEndDate = new Date();
		
		
		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id + '/building';
		DataService.getData(URI,[]).success(function(response){
			console.log(response.data);
			$scope.buildingData = response.data;
		}).error(function(err){
			alert(err.message);
			$modalInstance.close(false);
		});
	};

	$scope.ok = function() {

		console.log($scope.selectedBuilding);
		console.log($scope.selectedStartDate);
		console.log($scope.selectedEndDate);
		var transStartDt = DateFormatService.tranform_date($scope.selectedStartDate);
		var transEndDt = DateFormatService.tranform_date($scope.selectedEndDate);
		
		console.log(transStartDt + ' to ' + transEndDt);
		
		var params = {
				'start_date' : transStartDt,
				'end_date'	 : transEndDt,
				'building_id': $scope.selectedBuilding.building_id
		};
		
		DataService.postData(urlConstants.CONTRACT,params).success(function(response){
			console.log(response);
			$modalInstance.close(true);
		}).error(function(err){
			alert(err.message);
			$modalInstance.close(false);
			
		});
		
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

});