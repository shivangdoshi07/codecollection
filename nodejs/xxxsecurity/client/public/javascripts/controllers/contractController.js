xxxsecurity.controller("ContractCtrl", function($scope,DataService) {

	$scope.ContractInfo = function(contractid){

		console.log("In ContractInfo");
		console.log("contractid " + contractid);

		URI = urlConstants.CONTRACT + contractid;
		/**get building data for the buiding id**/
		DataService.getData(URI,[]).success(function(res){
			console.log("Contract Data");
			console.log(res);
			$scope.contractData = res.data[0];
		}).error(function(err){
			alert(err.message);
		});
	};
});
