angular.module('frontpage', ['ngMaterial'])
.controller('AppCtrl', function($scope) {
})
.controller('SignupController', function($scope){
	
})
.controller('ImageController', function($scope){
	$scope.images = [
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_1_150x150_v1.png"},
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_2_150x150_v1.png"},
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_3_150x150_v1.png"},
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_4_150x150_v1.png"},
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_5_150x150_v1.png"},
	                 {src:"https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_6_150x150_v1.png"},
	                 ]
})
.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('amber')
	    .accentPalette('deep-orange');
	})
