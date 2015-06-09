xxxsecurity.controller("GuardCtrl", function($scope,DataService,$rootScope) {

	$scope.GuardInfo = function(guardinfo){

		$rootScope.Searchid = "";

		console.log("In GuardInfo");
		console.log("guardinfo " + JSON.stringify(guardinfo));

		URI_guard = urlConstants.GUARD + guardinfo.person_id;
		/**get guard data for the guard id**/
		DataService.getData(URI_guard,[]).success(function(res){
			console.log("Guard Data");
			console.log(res);
			$scope.guardData = res.data[0];
		}).error(function(err){
			alert(err.message);
		});

		URI_guardschedule = urlConstants.GUARD + guardinfo.person_id + "/schedule";
		/**get guard data for the guard id**/
		DataService.getData(URI_guardschedule,[]).success(function(res){
			console.log("Guard Schedule Data");
			console.log(res);
			$scope.guardscheduleData = res.data;
		}).error(function(err){
			alert(err.message);
		});

	};


	$scope.SearchGuardInfo = function(){

		if($rootScope.Searchid != "")
		{
			console.log("In SearchGuardInfo");

			URI_guard = urlConstants.GUARD + $rootScope.Searchid;
			/**get guard data for the guard id**/
			DataService.getData(URI_guard,[]).success(function(res){
				console.log("Guard Data");
				console.log(res);
				$scope.guardData = res.data[0];
			}).error(function(err){
				alert(err.message);
			});

			URI_guardschedule_S = urlConstants.GUARD + $rootScope.Searchid + "/schedule";
			/**get guard data for the guard id**/
			DataService.getData(URI_guardschedule_S,[]).success(function(res){
				console.log("Guard Schedule Data");
				console.log(res);
				$scope.guardscheduleData = res.data;
			}).error(function(err){
				alert(err.message);
			});
		}
	};

});
