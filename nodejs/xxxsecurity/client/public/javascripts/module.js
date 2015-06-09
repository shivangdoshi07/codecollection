/**Angular module**/
var xxxsecurity = angular.module("xxxsecurity", [ 'ngRoute', 'ui.bootstrap','ngTable'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : '/partials/login',
		controller : 'LoginCtrl'
	}).when('/home', {
		templateUrl : '/partials/home',
		controller : 'HomeCtrl'
	}).otherwise({
		redirectTo : '/'
	});
	
	/**to remove hash in the URL**/
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});

}).run(['$rootScope','$window' ,'$location','$http','$templateCache','DataService',function($rootScope,$window, $location,$http,$templateCache,DataService) {
	
	$rootScope.$on('$routeChangeStart', function(event,next, current) {
		
		if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
		
		if($window.sessionStorage.token){
			$http.defaults.headers.common.Authorization = $window.sessionStorage.token;
			var params = {
					token : $window.sessionStorage.token
			};
			DataService.postData(urlConstants.TOKEN_VALID,params).success(function(response){
				/*console.log(response);*/
				$location.path('/home');
			}).error(function(err){
				$location.path('/');
			});
		}else{
			$location.path('/');
		}
	});
}]);

