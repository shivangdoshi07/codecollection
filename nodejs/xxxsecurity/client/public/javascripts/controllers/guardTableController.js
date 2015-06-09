xxxsecurity.controller("gTableCtrl", function($scope, DataService, $filter, ngTableParams,$window) {

		/* Fetching all buildings data */
		$scope.fetchGSchedules = function(){
			var URI = urlConstants.GUARD + $window.sessionStorage.person_id +"/schedule";

			DataService.getData(URI,[]).success(function(response){
				console.log("getData Schedules :" + JSON.stringify(response.data));
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
  	$scope.fetchGAlerts = function(){
  		var URI = urlConstants.GUARD + $window.sessionStorage.person_id +"/alert";
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
});