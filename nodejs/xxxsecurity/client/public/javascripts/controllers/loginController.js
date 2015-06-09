xxxsecurity.controller("LoginCtrl", function($scope,DataService,$location,$window,$http,DateFormatService) {

	$scope.alerts = [];

	$scope.closeAlert_Login = function(index) {
  $scope.alerts.splice(index, 1);
  };

	$scope.us_states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];
  
	$scope.myInterval= 4000;
	var slides = $scope.slides = [];

	/*slides.push({image : '../../images/carousel-1.jpg'});
	slides.push({image : '../../images/carousel-2.jpg'});
	slides.push({image : '../../images/carousel-3.jpg'});*/


	$scope.addSlide = function() {
		var newWidth = 600 + slides.length + 1;
		slides.push({
			image: 'http://placekitten.com/' + newWidth + '/300'
		});
	};
	for (var i=0; i<4; i++) {
		$scope.addSlide();
	}

	/**Login button callback**/
	$scope.login = function(){
		var params = {
				email : $scope.login_username,
				password : $scope.login_password
		};
		/**
		 * For encrypting password at client side as well
		 * $scope.pwd =
		 * CryptoJS.SHA256($scope.pwd).toString(CryptoJS.enc.hex);
		 */
		DataService.postData(urlConstants.LOGIN,params).success(function(response){
			console.log(response);
			$window.sessionStorage.token = response.token;
			$window.sessionStorage.username = response.data.name;
			$window.sessionStorage.email = response.data.email;
			$window.sessionStorage.role = response.role;
			$window.sessionStorage.person_id = response.data.person_id;
			$http.defaults.headers.common.Authorization = $window.sessionStorage.token;
			$location.path('/home');
		}).error(function(err){
			console.log(err);
			alert(err.message);
		});
	};

	/**Signup button callback**/
	$scope.signUp = function() {
		if ($scope.signUpForm.firstName.$invalid || $scope.signUpForm.lastName.$invalid	|| $scope.signUpForm.email.$invalid	|| $scope.signUpForm.pwd.$invalid) {
			$scope.alerts.push({msg: 'Form invalid. Please fill it again.'});
		} else {
			var dt = new Date();

			var start_date = DateFormatService.tranform_date(dt);

			var end_date = dt.setFullYear(dt.getFullYear()+1);
			end_date = DateFormatService.tranform_date(end_date);

			var params = {
					firstname	: $scope.firstname,
					lastname	: $scope.lastname,
					email 		: $scope.email,
					password 	: $scope.pwd,
					address		: $scope.address,
					city		: $scope.city,
					state		: $scope.state,
					zip_code	: $scope.zip_code,
					contact_no	: $scope.contact_no,
					start_date	: start_date,
					end_date	: end_date,
					ssn 		: $scope.ssn
			};

			DataService.postData(urlConstants.CLIENT, params).success(
					function(response) {
						console.log(response);
						$window.sessionStorage.token = response.token;
						$window.sessionStorage.username = response.data.name;
						$window.sessionStorage.email = response.data.email;
						$window.sessionStorage.role = response.role;
						$window.sessionStorage.person_id = response.data.person_id;
						$http.defaults.headers.common.Authorization = $window.sessionStorage.token;
						$location.path('/home');
					}).error(function(err) {
						console.log(err);
						//alert(err.message);
						$scope.alerts.push({msg: err.message});
					});
		}
	};
});
