xxxsecurity.controller("TableCtrl", function($scope, DataService, $filter, ngTableParams,$window,$modal) {

		/* Fetching all clients data */
		$scope.fetchAllClients = function(){
			var params = {};

			DataService.getData(urlConstants.CLIENT,params).success(function(response){
				/*console.log("getData Clients :" + JSON.stringify(response.data));*/
				var data = response.data;

				$scope.tableParams = new ngTableParams({
						page: 1,            // show first page
						count: 10,          // count per page
						filter: {
							firstname: ''       // initial filter
						},
						sorting: {
							firstname: ''     // initial sorting
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

		$scope.generate_bill = function(user){
			
			var modalInstance = $modal.open({
				templateUrl : 'templates/admin/generateBill.html',
				controller : 'GenerateBillCtrl',
				size : 'md',
				resolve : {
					client : function(){
						return user;
					}
				}
			});
			/**modal close callback**/
			modalInstance.result.then(function(valid) {
				
			}, function() {

			});
			
			
		};

		/* Fetching all buildings data */
		$scope.fetchAllBuildings = function(){
			var params = {};

			DataService.getData(urlConstants.BUILDING,params).success(function(response){
				/*console.log("getData Bulidings :" + JSON.stringify(response.data));*/
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


  	/* Fetching all guards data */
  	$scope.fetchAllGuards = function(){
  		var params = {};

  		DataService.getData(urlConstants.GUARD,params).success(function(response){
  			/*console.log("getData Guards :" + JSON.stringify(response.data));*/
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

  	/* Fetching all alerts data */
  	$scope.fetchAllAlerts = function(){
  		var params = {};

  		DataService.getData(urlConstants.ALERT,params).success(function(response){
  			/*console.log("getData Alerts :" + JSON.stringify(response.data));*/
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
  	$scope.fetchAllContracts = function(){
  		var params = {};

  		DataService.getData(urlConstants.CONTRACT,params).success(function(response){
  			/*console.log("getData Contracts :" + JSON.stringify(response.data));*/
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
  	
  	
  	$scope.reportTabInit = function(){
  		$scope.renderReport = false;
  	};
  	
  	$scope.fetchAllReports = function(){
  		
  		var params = {};

		DataService.getData(urlConstants.SCHEDULE_REPORTS,params).success(function(response){
			console.log("getData Reports :" + JSON.stringify(response));
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


		//Add functions

		//Add guards function
		$scope.addGuard = function(){
			var modalInstance = $modal.open({
				templateUrl : 'templates/admin/addGuard.html',
				controller : 'AddGuardCtrl',
				size : 'lg',
				resolve : {
				}
			});
			/**modal close callback**/
			modalInstance.result.then(function(valid) {
				if(valid){
					fetchAllGuards(function(){
						$scope.tableParams.reload();
					});
				}
			}, function() {

			});
		};


		//Functions for selecting the row in a table
		$scope.showClient = function(selectedRow){
			$scope.clientDetail = selectedRow;
			$scope.renderClient = true;
		};

		$scope.showBuilding = function(selectedRow){
			$scope.buildingDetail = selectedRow;
			$scope.renderBuilding = true;
		};

		$scope.showGuard = function(selectedRow){
			$scope.guardDetail = selectedRow;
			$scope.renderGuard = true;
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


		//Edit rows for tables
		$scope.editId_guard = -1;

		$scope.setEditId_Guard =  function(id) {
			//console.log("setEditId_Guard " + id);
			$scope.editId_guard = id;
		};

		//Alerts

		$scope.alerts_guard = [];

		$scope.closeAlert_Guard = function(index) {
		$scope.alerts_guard.splice(index, 1);
		};


});