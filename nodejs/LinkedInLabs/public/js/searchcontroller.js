var module = angular.module('frontpage');
module.factory('searchDataFactory', ['$http', function($http) {

    var urlBase = '/api/search';
    var searchDataFactory = {};

    searchDataFactory.getUserSearchResults = function (query) {
        return $http.get(urlBase + '/users/' + query);
    };

    return searchDataFactory;
}]);

module.controller('SearchResultController',function($scope, $routeParams, searchDataFactory){
	$scope.searchResultArray = [];
	getSearchResult($routeParams.q);
	console.log($routeParams.q);
	function getSearchResult(query){
		 searchDataFactory.getUserSearchResults(query)
		 				  .success(function(result){
		 					  for(var i = 0; i < result.length; i++){
		 						  result[i].lastlogin = convertTimestampToDate(result[i].lastlogin);
		 						 $scope.searchResultArray.push(result[i]);
		 					  }
		 				  });
	}
});