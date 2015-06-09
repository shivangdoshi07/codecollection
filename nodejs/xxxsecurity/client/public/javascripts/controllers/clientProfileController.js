xxxsecurity.controller("ClientProfileCtrl", function($scope, $modalInstance,DataService,$window) {

	$scope.getProfileData = function(){
		console.log("in get profile");
		
		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id;
		DataService.getData(URI,[]).success(function(response){
			console.log(response.data[0]);
			$scope.profileData = response.data[0];
		}).error(function(err){
			alert(err.message);
		});
	};

	$scope.ok = function() {

		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id;

		DataService.putData(URI,$scope.profileData).success(function(response){
			console.log(response);
			$modalInstance.close();
		}).error(function(err){
			$modalInstance.close();
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

});