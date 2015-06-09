xxxsecurity.controller("ClientCtrl", function($scope,DataService,$rootScope) {

	$scope.ClientInfo = function(clientinfo){

    $scope.clientdetails = clientinfo;
		$rootScope.Searchid = "";

		//console.log("In ClientInfo");
		console.log("clientid " + JSON.stringify(clientinfo));

    URI_clientbalance = urlConstants.CLIENT + clientinfo.person_id + "/balance";
    /**get client balance for the client id**/
    DataService.getData(URI_clientbalance,[]).success(function(res){
      //console.log("Balance for a client Data");
      //console.log(JSON.stringify(res));
      $scope.clientBalanceData = res.data[0];
    }).error(function(err){
      alert(err.message);
    });

		URI_clientcontract = urlConstants.CLIENT + clientinfo.person_id + "/contract";
		/**get client buildings for the client id**/
		DataService.getData(URI_clientcontract,[]).success(function(res){
			//console.log("Buildings for a client Data");
			//console.log(JSON.stringify(res));
			$scope.clientContractsData = res.data;
		}).error(function(err){
			alert(err.message);
		});

	};



		$scope.SearchClientInfo = function(){

			if($rootScope.Searchid != "")
			{
				console.log("$rootScope.Searchid SearchClientInfo : " + $rootScope.Searchid);
		    $scope.clientdetails_S = $rootScope.Searchid;
				//$scope.clientdetails_S = 8;

				//console.log("In ClientInfo");
				console.log("clientdetails_S " + JSON.stringify($scope.clientdetails_S));

		    URI_clientbalance_S = urlConstants.CLIENT + $scope.clientdetails_S  + "/balance";
		    /**get client balance for the client id**/
		    DataService.getData(URI_clientbalance_S,[]).success(function(res){
		      //console.log("Balance for a client Data");
		      console.log(JSON.stringify(res));
		      $scope.clientBalanceData = res.data[0];
		    }).error(function(err){
		      alert(err.message);
		    });

				URI_clientcontract_S = urlConstants.CLIENT + $scope.clientdetails_S  + "/contract";
				/**get client buildings for the client id**/
				DataService.getData(URI_clientcontract_S,[]).success(function(res){
					//console.log("Buildings for a client Data");
					console.log(JSON.stringify(res));
					$scope.clientContractsData = res.data;
				}).error(function(err){
					alert(err.message);
				});
			}
		};

});