xxxsecurity.controller("BuildingCtrl", function($scope,DataService,$rootScope) {

	$scope.BuildingInfo = function(buildingid){

		$rootScope.Searchid = "";

		console.log("In BuildingInfo");
		console.log("buildingid " + buildingid);
		getCheckPointDetails(buildingid);
		URI_buiding = urlConstants.BUILDING + buildingid;
		/**get building data for the building id**/
		DataService.getData(URI_buiding,[]).success(function(res){
			console.log("Building Data");
			console.log(res);
			$scope.buildingData = res.data[0];
		}).error(function(err){
			alert(err.message);
		});

		URI_buidingGuard = urlConstants.BUILDING + buildingid + "/guard";
		/**get building data for the buiding id**/
		DataService.getData(URI_buidingGuard,[]).success(function(res){
			console.log("Guard for Building Data");
			console.log(res);
			$scope.buildingGuardData = res.data;
		}).error(function(err){
			alert(err.message);
		});

	};


	$scope.SearchBuildingInfo = function(){

		if($rootScope.Searchid != "")
		{
			console.log("In SearchBuildingInfo : " + $rootScope.Searchid);
			getCheckPointDetails($rootScope.Searchid);

			URI_buiding_S = urlConstants.BUILDING + $rootScope.Searchid;
			/**get building data for the buiding id**/
			DataService.getData(URI_buiding_S,[]).success(function(res){
				console.log("Building Data");
				console.log(res);
				$scope.buildingData = res.data[0];
			}).error(function(err){
				alert(err.message);
			});

			URI_buidingGuard_S = urlConstants.BUILDING + $rootScope.Searchid + "/guard";
			/**get building data for the buiding id**/
			DataService.getData(URI_buidingGuard_S,[]).success(function(res){
				console.log("Guard for Building Data");
				console.log(res);
				$scope.buildingGuardData = res.data;
			}).error(function(err){
				alert(err.message);
			});
		}
	};

	function getCheckPointDetails(building_id){
		var URI = urlConstants.BUILDING + building_id + '/checkpoint';
		console.log(URI);
			DataService.getData(URI,[]).success(function(response){

				console.log(response.data);
				/*var myLatlng = new google.maps.LatLng(-25.363882,131.044922);*/
				/*response.data.forEach(function(checkpoint){

				});*/
				$scope.checkpoints = response.data;
				google.maps.event.addDomListener(window, 'load', initialize());

			}).error(function(err){
				$modalInstance.dismiss();
			});
	}
	function initialize() {

		console.log("in initialize");

		var mapOptions = {
				center: new google.maps.LatLng(41.850033, -87.6500523),
				zoom: 13
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
		var bounds = new google.maps.LatLngBounds();

		var input = /** @type {HTMLInputElement} */(
				document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0, -29)
		});


		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			/*console.log("in auto");*/
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("Autocomplete's returned place contains no geometry");
				return;
			}

			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  // Why 17? Because it looks good.
			}
			marker.setIcon(/** @type {google.maps.Icon} */({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				           (place.address_components[0] && place.address_components[0].short_name || ''),
				           (place.address_components[1] && place.address_components[1].short_name || ''),
				           (place.address_components[2] && place.address_components[2].short_name || '')
				           ].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});


		$scope.checkpoints.forEach(function(checkpoint){

			var coords =  checkpoint.coords.split(",");
			var lat = coords[0];
			var long = coords[1];
			var myLatlng = new google.maps.LatLng(lat,long);

			/*var mapOptions = {
				    zoom: 20,
				    center: myLatlng
				  };
				  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				  var marker = new google.maps.Marker({
				      position: myLatlng,
				      map: map,
				      title: checkpoint.checkpoint_name
				  });*/

			var position = new google.maps.LatLng(lat, long);
			bounds.extend(position);
			marker = new google.maps.Marker({
				position: position,
				map: map,
				title: checkpoint.checkpoint_name
			});
			map.fitBounds(bounds);

		});


		google.maps.event.addListenerOnce(map, 'idle', function(){
		        google.maps.event.trigger(map, 'resize');
		        map.setCenter(location);
		    });


		
	}

});