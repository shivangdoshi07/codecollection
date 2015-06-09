xxxsecurity.controller("cTableCtrl", function($scope, DataService, $filter, ngTableParams,$window,$modal) {

	/* Fetching all buildings data */
	$scope.fetchCBuildings = function(){

		getBuildingData(function(){

			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					name: ''       // initial filter
				},
				sorting: {
					name: ''     // initial sorting
				}
			}, {
				total: $scope.buildingTableData.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
							$filter('filter')($scope.buildingTableData, params.filter()) :
								$scope.buildingTableData;
							var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
										$scope.buildingTableData;

									params.total(orderedData.length); // set total for recalc pagination
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		});
	};

	/**add building callback**/
	$scope.addBuilding = function(){
		var modalInstance = $modal.open({
			templateUrl : 'templates/client/addBuilding.html',
			controller : 'AddBuildingCtrl',
			size : 'lg',
			resolve : {
			}
		});
		/**modal close callback**/
		modalInstance.result.then(function(valid) {
			if(valid){
				getBuildingData(function(){
					$scope.tableParams.reload();
				});
			}
		}, function() {

		});
	};

	/**Edit a building**/
	$scope.editBuilding = function(building){

		console.log(building);
		var URI = urlConstants.BUILDING + building.building_id;
		DataService.putData(URI,building).success(function(response){

			console.log(response);

		}).error(function(err){
			console.log(err);
		});
	};


	/* Fetching all alerts data */
	$scope.fetchCAlerts = function(){
		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/alert";
		DataService.getData(URI,[]).success(function(response){
			console.log("getData Alerts :" + JSON.stringify(response.data));
			var data = response.data;

			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					name: ''       // initial filter
				},
				sorting: {
					name: ''     // initial sorting
				}
			}, {
				total: data.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
							$filter('filter')(data, params.filter()) :
								data;
							var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
										data;

									params.total(orderedData.length); // set total for recalc pagination
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}).error(function(err){
			console.log(err);
		});
	};


	/* Fetching all contracts data */
	$scope.fetchCContracts = function(){

		getContractData(function(){
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					name: ''       // initial filter
				},
				sorting: {
					name: ''     // initial sorting
				}
			}, {
				total: $scope.contractTableData.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
							$filter('filter')($scope.contractTableData, params.filter()) :
								$scope.contractTableData;
							var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
										$scope.contractTableData;

									params.total(orderedData.length); // set total for recalc pagination
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		});
	};

	/**add contract callback**/
	$scope.addContract = function(){
		var modalInstance = $modal.open({
			templateUrl : 'templates/client/addContract.html',
			controller : 'AddContractCtrl',
			size : 'lg',
			resolve : {
			}
		});
		/**modal close callback**/
		modalInstance.result.then(function(valid) {
			if(valid){
				getContractData(function(){
					$scope.tableParams.reload();
				});
			}
		}, function() {

		});
	};


	/**report tab init**/
	$scope.reportTabInit = function(){
		$scope.renderReport = false;
	};

	/** Fetching report data **/
	$scope.fetchAllReports = function(){

		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/scheduleForReport";

		DataService.getData(URI,[]).success(function(response){
			console.log("getData Schedule :" + JSON.stringify(response.data));
			var data = response.data;

			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					client_name: ''       // initial filter
				},
				sorting: {
					client_name: ''     // initial sorting
				}
			}, {
				total: data.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
							$filter('filter')(data, params.filter()) :
								data;
							var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
										data;

									params.total(orderedData.length); // set total for recalc pagination
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}).error(function(err){
			console.log(err);
		});

	};

	/**schedule select callback**/
	$scope.showReport = function(selectedRow){
		$scope.scheduleForReport = selectedRow;
		$scope.renderReport = true;
	};


	/* Fetching all bills data */
	$scope.fetchCBill = function(){

		getBillData(function(){
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {
					name: ''       // initial filter
				},
				sorting: {
					name: ''     // initial sorting
				}
			}, {
				total: $scope.billTableData.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
							$filter('filter')($scope.billTableData, params.filter()) :
								$scope.billTableData;
							var orderedData = params.sorting() ?
									$filter('orderBy')(filteredData, params.orderBy()) :
										$scope.billTableData;

									params.total(orderedData.length); // set total for recalc pagination
									$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		});
	};

	/**function to get contract data**/
	function getContractData(callback) {

		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/contract";

		DataService.getData(URI,[]).success(function(response){
			console.log("getData Contracts :" + JSON.stringify(response.data));
			$scope.contractTableData = response.data;
			callback();
		}).error(function(err){

		});

	}

	/**function to get bill data**/
	function getBillData(callback) {

		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/bill";

		DataService.getData(URI,[]).success(function(response){
			console.log("getData Contracts :" + JSON.stringify(response.data));
			$scope.billTableData = response.data;
			callback();
		}).error(function(err){

		});

	}

	/**function to get building data**/
	function getBuildingData(callback) {

		var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/building";

		DataService.getData(URI,[]).success(function(response){
			console.log("getData Bulidings :" + JSON.stringify(response.data));
			$scope.buildingTableData = response.data;
			callback();
		}).error(function(err){
			console.log(err);
		});
	}


	$scope.showBuilding = function(selectedRow){
		$scope.buildingDetail = selectedRow;
		$scope.renderBuilding = true;
	};

	$scope.showAlert = function(selectedRow){
		$scope.alertDetail = selectedRow;
		$scope.renderGuard= true;
	};


	$scope.showContract = function(selectedRow){
		$scope.contractDetail = selectedRow;
		$scope.renderContract = true;
	};


	$scope.showReport = function(selectedRow){
		$scope.scheduleForReport = selectedRow;
		$scope.renderReport = true;
	};



	$scope.deleteBuilding = function(buiding_id) {

		var URI = urlConstants.BUILDING + buiding_id;

		DataService.deleteData(URI,[]).success(function(response){

			getBuildingData(function(){
					$scope.tableParams.reload();
				});

		}).error(function(err){
			alert(err.message);
			console.log(err);
		});

	};



});
