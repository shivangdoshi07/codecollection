xxxsecurity.controller("UserCtrl", function($scope, DataService, $filter, ngTableParams) {

	$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
		
	
		if($scope.role==="CLIENT"){
			$scope.templateurl = "templates/client/cHome.html";
		}else if($scope.role==="GUARD"){
			$scope.templateurl = "templates/guard/gSchedules.html";
		}
		
		$scope.changeTableData = function(templateUrl){

			$scope.templateurl = templateUrl;

		};

});
