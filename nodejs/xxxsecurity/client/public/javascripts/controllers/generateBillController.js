xxxsecurity.controller("GenerateBillCtrl", function($scope, $modalInstance,client,DataService,$window,DateFormatService) {

	
	$scope.init = function(){
		$scope.showData = false;
		$scope.hasData = false;
		$scope.client = client;
	};
	
	
	$scope.ok = function(){
		
		var URI = urlConstants.CLIENT + client.person_id +'/bill';
		DataService.postData(URI,[]).success(function(response){
			/*console.log(response);*/
			$scope.hasData = true;
			$scope.client_name = $scope.client.firstname+" " +$scope.client.lastname;
			if(response.data.status==="unpaid"){
				console.log(client);
				$scope.bill_date = response.data.created_on;
				$scope.payment_on = response.data.payment_on;
				$scope.amount = response.data.amount;
				$scope.showData = true;
			}
			
		}).error(function(err){
			
		});
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss();
	};

});
