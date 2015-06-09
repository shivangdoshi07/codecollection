xxxsecurity.controller("SearchCtrl", function($scope,DataService,$location,$window,$http,$rootScope,$modal) {

	var URI = urlConstants.SEARCH;
	$scope.datas = [{}];
	var output = [];
	/*$scope.getData = function(val) {
		DataService.getData(URI+'?query='+val,{
		  params: {}
		})
		.success(function(response){
		  $scope.datas = response.data;
		  console.log();
		});
	};*/

	$scope.getData = function(val) {
		DataService.getData(URI+'?query='+val,{
		  params: {}
		}).then(function(response){
	       	angular.forEach(response.data.data, function(item){
	        	output.push(item);
	      	});
	    });

		return output;
	};
});