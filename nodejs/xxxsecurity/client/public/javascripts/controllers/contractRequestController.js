xxxsecurity.controller("ContractRequestCtrl", function($scope, $modalInstance,contract,DataService,$window,$filter) {

	/*console.log(contract);*/
	
	$scope.fetchAvailableGuards = function(){
		
		$scope.contract = contract;
		$scope.start_time = new Date();
		$scope.end_time = new Date();

		var URI = urlConstants.BUILDING + contract.building_id + '/checkpoint';

		DataService.getData(URI,[]).success(function(response){
			$scope.checkpoints = response.data;
			google.maps.event.addDomListener(window, 'load', initialize());

		}).error(function(err){
			$modalInstance.dismiss();
		});

		URI = urlConstants.GUARD + 'available';
		DataService.getData(URI,[]).success(function(response){
			
			/*console.log(response.data[0]);*/
			$scope.availableGuards = response.data[0].count;
			
		}).error(function(err){
			$modalInstance.dismiss();
		});
	};
	
	
	$scope.ok = function() {
		
		var new_start_time = $filter('date')($scope.start_time,'shortTime');
		var new_end_time = $filter('date')($scope.end_time,'shortTime');
		$scope.contract.status = "active";
		
		var URI = urlConstants.CONTRACT + $scope.contract.contract_id;
		
		DataService.putData(URI,$scope.contract).success(function(response){
			console.log(response);
			$modalInstance.close(true);
		}).error(function(err){
			$modalInstance.dismiss();
		});
	};

	$scope.cancel = function() {
		$scope.contract.status = "reject";
		
		var new_start_time = $filter('date')($scope.start_time,'shortTime');
		var new_end_time = $filter('date')($scope.end_time,'shortTime');
		
		var URI = urlConstants.CONTRACT + $scope.contract.contract_id;
		DataService.putData(URI,$scope.contract).success(function(response){
			console.log(response);
			$modalInstance.close(false);
		}).error(function(err){
			$modalInstance.dismiss();
		});
	};


	function initialize() {

		console.log("in initialize");

		var mapOptions = {
				center: new google.maps.LatLng(-33.8688, 151.2195),
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

		/*// Sets a listener on a radio button to change the filter type on Places
		// Autocomplete.
		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
			google.maps.event.addDomListener(radioButton, 'click', function() {
				autocomplete.setTypes(types);
			});
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-address', ['address']);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);*/
	}

});