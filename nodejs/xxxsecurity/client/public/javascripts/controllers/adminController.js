xxxsecurity.controller("AdminCtrl", function($scope, DataService, $filter, ngTableParams, $rootScope) {

	$scope.initTemplate = function(){

		$rootScope.templateurl = "templates/admin/aHome.html";

	};



	$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });



		$scope.changeTableData = function(templateUrl){

			$rootScope.templateurl = templateUrl;

		};


		$scope.searchTableData = function(templateUrl,id){

			$rootScope.templateurl = templateUrl;
			$rootScope.Searchid = id;

			console.log("$rootScope.templateurl : " + $rootScope.templateurl);
			console.log("$rootScope.Searchid : " + $rootScope.Searchid);

		};

});
