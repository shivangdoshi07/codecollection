xxxsecurity.controller("EditGuardCtrl", function($scope,DataService,$window) {


  $scope.closeAlert = function(index) {
  $scope.alerts.splice(index, 1);
  };

	$scope.ok = function(userdetail) {

    console.log("Edit Guard call");
    console.log("updateGuardForm : " + JSON.stringify($scope.updateGuardForm.address));

    $scope.alerts = [];

     if ($scope.updateGuardForm.address.$invalid || $scope.updateGuardForm.city.$invalid	|| $scope.updateGuardForm.state.$invalid	|| $scope.updateGuardForm.zip_code.$invalid ||
      $scope.updateGuardForm.contact_no.$invalid ){

      $scope.alerts.push({msg: 'Form invalid. Please fill it again.'});
		}
    else
    {
      console.log("Valid form");
      var URI = urlConstants.GUARD + $scope.$parent.user.person_id ;

  		var params = {


        "person_id" : $scope.$parent.user.person_id,
        "address" : $scope.updateGuardForm.address.$modelValue,
        "city"  : $scope.updateGuardForm.city.$modelValue,
        "state" : $scope.updateGuardForm.state.$modelValue,
        "zip_code"  : $scope.updateGuardForm.zip_code.$modelValue,
        "contact_no" : $scope.updateGuardForm.contact_no.$modelValue

  		};

      console.log("params for adding Guard : " + JSON.stringify(params));

  		DataService.putData(URI,params).success(function(response){
  			console.log(response);
        $scope.$parent.setEditId_Guard(-1);
  		}).error(function(err){
        $scope.alerts.push({msg: 'Error occured while saving'});

  		});
    }

	};

	$scope.cancel = function() {
    $scope.$parent.setEditId_Guard(-1);
	};

});
