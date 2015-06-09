xxxsecurity.controller("AddBuildingCtrl", function($scope, $modalInstance,DataService,$window) {

	
	$scope.init=function(){
		/*console.log("in init");*/
		$scope.checkpoints = [];
		google.maps.event.addDomListener(window, 'load', initialize());
	};
	
	
	$scope.ok = function() {
		
		var addressesArr = $scope.selectedLocation.split(', ');
		var state_zip = addressesArr[2].split(' ');
		if(state_zip == undefined)
			state_zip = 00000; //incase zip is not present add default
		console.log(addressesArr);
		var params = {
				'name' : $scope.building_name,
				'address' : addressesArr[0],
				'city' : addressesArr[1],
				'state' : state_zip[0],
				'zip_code' : state_zip[1],
				'checkpoints' : $scope.checkpoints, 
				'client_id' : $window.sessionStorage.person_id
		};
		
		console.log(params);

		DataService.postData(urlConstants.BUILDING,params).success(function(response){
			console.log(response);
			$modalInstance.close(true);
		}).error(function(err){
			alert(err.message);
			$modalInstance.close(false);
			
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};


	function initialize() {
		
		/*console.log("in initialize");*/
		
		var mapOptions = {
				center: new google.maps.LatLng(parseFloat(-33.8668283734),parseFloat(151.2064891821)),
				zoom: 13
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
		
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
			/*console.log(place);*/
			$scope.building_name = place.name;
			$scope.selectedLocation = place.formatted_address;
			console.log(place.geometry.location.lng());
			
			$scope.checkpoints.push({'checkpoint_name' : place.name,'lat' : place.geometry.location.lat(), 'long' : place.geometry.location.lng()});

			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
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
		
		google.maps.event.addListener(map, 'click', function(event) {
			  placeMarker(event.latLng);
			});

			function placeMarker(location) {
			   var marker = new google.maps.Marker({
			       position: location,
			       map: map,
			       draggable:true,
			       animation: google.maps.Animation.DROP
			   });
			   console.log(marker.position.lat());
			   var num = $scope.checkpoints.length + 1;
			   var checkpoint_name = 'Checkpoint-'+num;
			   $scope.checkpoints.push({'checkpoint_name' : checkpoint_name,'lat' : marker.position.lat(), 'long' : marker.position.lng()});
			}
			
			google.maps.event.addListenerOnce(map, 'idle', function(){
		        google.maps.event.trigger(map, 'resize');
		        map.setCenter(location);
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