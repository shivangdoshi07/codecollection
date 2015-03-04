var module = angular.module('frontpage');
module.factory('dataFactory', ['$http', function($http) {

    var urlBase = '/api/user';
    var dataFactory = {};

    dataFactory.getUser = function (id) {
        return $http.get(urlBase + '/' + id);
    };
    
    dataFactory.getUserMeta = function (id) {
        return $http.get(urlBase + '/meta/' + id);
    };
    
    dataFactory.getSpecificUserMeta = function (meta,id) {
        return $http.get(urlBase + '/meta/'+ meta + '/' + id);
    };

    dataFactory.updateCustomer = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

/*    dataFactory.deleteCustomer = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    dataFactory.getOrders = function (id) {
        return $http.get(urlBase + '/' + id + '/orders');
    };*/

    return dataFactory;
}]);
module.controller('ProfileController', function($scope, $rootScope, dataFactory) {
	$scope.userdetails;
	$scope.usermeta;
		getUserInfo();
			function getUserInfo(){
				dataFactory.getUser($rootScope.user.id).success(function(info){
					$scope.userdetails = info[0];
					$scope.userdetails.lastlogin =convertTimestampToDate(info[0].timestamp);
				})
			}
		});
module.controller('EducationController', function($scope, $mdDialog){
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'education.html',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	console.log(answer);
	      $scope.alert = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.alert = 'You cancelled the dialog.';
	    });
	  };
});

function convertTimestampToDate(timestamp){
	var d = new Date(timestamp);
	return d.toDateString() + " " + d.toLocaleTimeString();
}

function DialogController($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
		if(answer.from <= answer.to && answer.name != null && answer.degree != null){
			$mdDialog.hide(answer);
			$scope.error = "";
		}
		else if(answer.from > answer.to)
			$scope.error = "Error in Year selection!";
	  };
	}
		