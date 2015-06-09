xxxsecurity.controller("AddGuardCtrl", function($scope, $modalInstance,DataService,$window,DateFormatService) {


  $scope.startdateselected;
  $scope.enddateselected

  $scope.closeAlert = function(index) {
  $scope.alerts.splice(index, 1);
  };

	$scope.ok = function() {

    $scope.alerts = [];

    if ($scope.addGuardForm.firstname.$invalid || $scope.addGuardForm.lastname.$invalid	|| $scope.addGuardForm.email.$invalid	|| $scope.addGuardForm.password.$invalid ||
     $scope.addGuardForm.address.$invalid || $scope.addGuardForm.city.$invalid	|| $scope.addGuardForm.state.$invalid	|| $scope.addGuardForm.zip_code.$invalid ||
     $scope.addGuardForm.contact_no.$invalid || $scope.addGuardForm.start_date.$invalid	|| $scope.addGuardForm.end_date.$invalid	|| $scope.addGuardForm.ssn.$invalid ||
     $scope.addGuardForm.bg_status.$invalid || $scope.addGuardForm.wkly_wrk_hrs.$invalid )
    {

      $scope.alerts.push({msg: 'Form invalid. Please fill it again.'});
		}
    else
    {
      var URI = urlConstants.GUARD;

  		var params = {

        "firstname" : $scope.guard_info.firstname,
        "lastname" : $scope.guard_info.lastname,
        "email" : $scope.guard_info.email,
        "password"  : $scope.guard_info.password,
        "address" : $scope.guard_info.address,
        "city"  : $scope.guard_info.city,
        "state" : $scope.guard_info.state,
        "zip_code"  : $scope.guard_info.zip_code,
        "contact_no" : $scope.guard_info.contact_no,
        "start_date"  : $scope.addGuardForm.start_date.$modelValue,
        "end_date" : $scope.addGuardForm.end_date.$modelValue,
        "ssn" : $scope.guard_info.ssn,
        "bg_status" : $scope.guard_info.bg_status,
        "wkly_wrk_hrs"  : $scope.guard_info.wkly_wrk_hrs,
        "is_occupied" : "0"

  		};

      console.log("params for adding Guard : " + JSON.stringify(params));

  		DataService.postData(URI,params).success(function(response){
  			console.log(response);
  			$modalInstance.close(true);
  		}).error(function(err){
  			alert(err.message);
  			$modalInstance.close(false);

  		});
    }

	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

});
