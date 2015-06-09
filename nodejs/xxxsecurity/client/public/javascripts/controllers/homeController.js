xxxsecurity.controller("HomeCtrl", function($scope,DataService,$location,$window,$http,$rootScope,$modal) {

	$rootScope.username = $window.sessionStorage.username;
	$rootScope.email = $window.sessionStorage.email;
	$rootScope.role = $window.sessionStorage.role;

	/**Signout button callback**/
	$scope.signout = function(){
		var params = {};
		DataService.postData(urlConstants.SIGNOUT,params).success(function(response){
			/*console.log(response);*/
			delete $window.sessionStorage.token;
			delete $window.sessionStorage.username;
			delete $window.sessionStorage.role;
			delete $window.sessionStorage.email;
			delete $window.sessionStorage.person_id;
			$http.defaults.headers.common.Authorization = undefined;
			$location.path('/');
		}).error(function(err){
			console.log(err);
		});
	};

	/**admin profile callback**/
	$scope.profile = function(){

		var modalInstance = $modal.open({
			templateUrl : 'templates/admin/profile.html',
			controller : 'AdminProfileCtrl',
			size : 'lg',
			resolve : {
				/*companies : function() {
					return $scope.companies;
				},
				isEdit : function(){
					return data;
				}*/
			}
		});

		modalInstance.result.then(function() {

		}, function() {

		});
	};

	/**user profile callback**/
	$scope.userProfile = function(){

		if($rootScope.role==="CLIENT"){
			var modalInstance = $modal.open({
				templateUrl : 'templates/client/cProfile.html',
				controller : 'ClientProfileCtrl',
				size : 'lg',
				resolve : {
				}
			});

			modalInstance.result.then(function() {

			}, function() {

			});
		} else if($rootScope.role==="GUARD"){

			var modalInstance = $modal.open({
				templateUrl : 'templates/guard/gProfile.html',
				controller : 'GuardProfileCtrl',
				size : 'lg',
				resolve : {
				}
			});

			modalInstance.result.then(function() {

			}, function() {

			});
		}

	};

	/**ng init for fetching all contract requests**/
	$scope.getContractRequest = function(){

		if($rootScope.role==="ADMIN"){

			DataService.getData(urlConstants.CONTRACT_REQUESTS,[]).success(function(response){
				/*console.log(response.data);*/
				$scope.contractRequests = response.data;

			}).error(function(err){
				console.log(err);
			});
		}else{

		}

	};

	/**contract select callback**/
	$scope.showContractRequest = function(contract){
		/*console.log(contract);*/

		var modalInstance = $modal.open({
			templateUrl : 'templates/admin/contractRequest.html',
			controller : 'ContractRequestCtrl',
			size : 'lg',
			resolve : {
				'contract' : function(){
					return contract;
				}
			}
		});

		modalInstance.result.then(function(valid) {
			$scope.getContractRequest();
		}, function() {
			console.log("dismiss");
		});



	};


});
