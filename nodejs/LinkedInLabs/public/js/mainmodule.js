angular
		.module('frontpage', [ 'ngMaterial','ngRoute','ngMdIcons','mdChips' ])

		.controller('AppCtrl', function($scope,$window,$rootScope) {
			if($window.sessionStorage.user != null)
				$rootScope.user = JSON.parse($window.sessionStorage.user); 
		})
		.controller(
				'LoginController',
				function($scope, $http, $location, $rootScope, $window) {
					var isLoaderVisible = false;
					$scope.displayLoader = function() {
						return isLoaderVisible;
					}
					$scope.login = function(username, password) {
						isLoaderVisible = true;
						var credentials = {};
						credentials.email = username;
						credentials.password = password;
						
						$http.post('/api/session/login', credentials).success(
								function(data, status, headers, config) {
									isLoaderVisible = false;
									$rootScope.user = data.user;
									$window.sessionStorage.user = JSON.stringify(data.user);
									console.log(data.user);
									$location.path('/home');
								}).error(
								function(data, status, headers, config) {
									isLoaderVisible = false;
									console.log(data, status, headers, config);
								});
					}
				})
		.controller('SignupController', function($scope, $http, $rootScope, $window, $location) {
			$scope.signup = function(newUser) {
				isLoaderVisible = true;
				var credentials = {};
				
				$http.post('/api/user', newUser).success(
						function(data, status, headers, config) {
							isLoaderVisible = false;
							$rootScope.user = data.user;
							$window.sessionStorage.user = JSON.stringify(data.user);
							console.log(data.user);
							$location.path('/home');
						}).error(
						function(data, status, headers, config) {
							isLoaderVisible = false;
							console.log(data, status, headers, config);
						});
			}
		})
		.controller(
				'ImageController',
				function($scope) {
					$scope.images = [
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_1_150x150_v1.png"
							},
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_2_150x150_v1.png"
							},
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_3_150x150_v1.png"
							},
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_4_150x150_v1.png"
							},
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_5_150x150_v1.png"
							},
							{
								src : "https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_6_150x150_v1.png"
							}, ]
				}).config(
				function($mdThemingProvider,$routeProvider) {
					$mdThemingProvider.theme('default').primaryPalette('indigo')
							.accentPalette('red');
					//$routeProvider
					$routeProvider
						.when('/', {
							templateUrl: '/login',
							controller: 'LoginController'
						})
						.when('/user/:id', {
						    templateUrl: '/public',
						    controller: 'LoginController'
						  })
						  .when('/search/:q', {
						    templateUrl: '/search',
						    controller: 'LoginController'
						  })
						.when('/home', {
							templateUrl: '/home',
							controller: 'LoginController'
						})
						.when('/connections', {
							templateUrl: '/connections',
							controller: 'LoginController'
						})
						.otherwise({
							redirectTo: '/'
						});
				})
