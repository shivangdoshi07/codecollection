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
    
    dataFactory.setSpecificUserMeta = function (meta_key,meta_value,id) {
        return $http.post(urlBase + '/meta/'+ meta_key + '/' + id,meta_value);
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

module.controller('EducationController', function($scope, $mdDialog, dataFactory, $rootScope){
	$scope.schoolArray = [];
	getUserMeta('education');
	function getUserMeta(meta_key){
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.schoolArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: EducationDialogController,
	      templateUrl: 'education.html',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	console.log(answer);
	    	dataFactory.setSpecificUserMeta('education',answer,$rootScope.user.id)
				    	.success(function(data){
							   getUserMeta('education');
						   });
	    }, function() {
	    	//this is on cancel
	    });
	  };
});

function EducationDialogController($scope, $mdDialog) {
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

module.controller('ExperienceController', function($scope, $mdDialog, dataFactory, $rootScope){
	$scope.companyArray = [];
	getUserMeta('experience');
	function getUserMeta(meta_key){
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.companyArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: ExperienceDialogController,
	      templateUrl: 'experience.html',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	dataFactory.setSpecificUserMeta('experience',answer,$rootScope.user.id)
	    			   .success(function(data){
	    				   getUserMeta('experience');
	    			   });
	    }, function() {
	    });
	  };
});

function ExperienceDialogController($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
		if(answer.from <= answer.to && answer.name != null && answer.post != null){
			$mdDialog.hide(answer);
			$scope.error = "";
		}
		else if(answer.from > answer.to)
			$scope.error = "Error in Year selection!";
	  };
	}

module.controller('SkillController', function($scope, $mdDialog, dataFactory, $rootScope){
	$scope.skillArray = [];
	getUserMeta('skill');
	function getUserMeta(meta_key){
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.skillArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: SkillDialogController,
	      templateUrl: 'skill.html',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	console.log(answer);
	    	answer.endorsedby = 0; //initialize the value by 0. Will increment when others endorse the user
	    	dataFactory.setSpecificUserMeta('skill',answer,$rootScope.user.id)
	    			   .success(function(data){
	    				   getUserMeta('skill');
	    			   });
	    }, function() {
	    });
	  };
});

function SkillDialogController($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
			$mdDialog.hide(answer);
			$scope.error = "";
	  };
	}

function convertTimestampToDate(timestamp){
	var d = new Date(timestamp);
	return d.toDateString() + " " + d.toLocaleTimeString();
}