var module = angular.module('frontpage');
module.factory('dataFactory', ['$http', function($http) {

    var urlBase = '/api/user';
    var dataFactory = {};
    
    dataFactory.getUsers = function () {
        return $http.get(urlBase);
    };
    
    dataFactory.getUser = function (id) {
        return $http.get(urlBase + '/' + id);
    };
    
    dataFactory.getUserMeta = function (id) {
        return $http.get(urlBase + '/meta/' + id);
    };
    
    dataFactory.getSpecificUserMeta = function (meta,id) {
        return $http.get(urlBase + '/meta/'+ meta + '/' + id);
    };
    
    dataFactory.getUserConnections = function (id) {
        return $http.get(urlBase + '/connections/'+id);
    };
    
    dataFactory.setSpecificUserMeta = function (meta_key,meta_value,id) {
        return $http.post(urlBase + '/meta/'+ meta_key + '/' + id,meta_value);
    };

    dataFactory.updateUserMeta = function (userid,metaid,meta_value) {
        return $http.put(urlBase + '/meta/'+ userid + '/' + metaid, meta_value)
    };
    
    dataFactory.deleteUserMeta = function (userid,id) {
        return $http.delete(urlBase + '/meta/'+ userid + '/' + id);
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

module.controller('SummaryController', function($scope, $mdDialog, dataFactory, $rootScope){
	getUserMeta('summary');
	function getUserMeta(meta_key){
		$scope.summaryArray = [];
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			if(meta_info.length > 0){
				var tempJson = JSON.parse(meta_info[meta_info.length-1].meta_value);
				tempJson.id = meta_info[meta_info.length-1].id; 
				$scope.summaryArray.push(tempJson);
			}
		})
	}
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: SummaryDialogController,
	      templateUrl: 'summary.html',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	dataFactory.setSpecificUserMeta('summary',answer,$rootScope.user.id)
	    			   .success(function(data){
	    				   getUserMeta('summary');
	    			   });
	    }, function() {
	    });
	  };
	  
	  $scope.deleteMeta = function(id){
		  dataFactory.deleteUserMeta($rootScope.user.id,id)
		  			 .success(function(res){
		  				getUserMeta('summary');
		  			 });
	  };
});

function SummaryDialogController($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
		  if(answer != null){
			  $mdDialog.hide(answer);
			  $scope.error = "";  
		  }
	  };
	}

module.controller('EducationController', function($scope, $mdDialog, dataFactory, $rootScope){
	
	getUserMeta('education');
	function getUserMeta(meta_key){
		$scope.schoolArray = [];
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				var tempJson = JSON.parse(meta_info[int].meta_value);
				tempJson.id = meta_info[int].id;
				$scope.schoolArray.push(tempJson);
				
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
	    	dataFactory.setSpecificUserMeta('education',answer,$rootScope.user.id)
				    	.success(function(data){
							   getUserMeta('education');
						   });
	    }, function() {
	    	//this is on cancel
	    });
	  };
	  
	  $scope.deleteMeta = function(id){
		  dataFactory.deleteUserMeta($rootScope.user.id,id)
		  			 .success(function(res){
		  				getUserMeta('education');
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
	getUserMeta('experience');
	function getUserMeta(meta_key){
		$scope.companyArray = [];
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				var tempJson = JSON.parse(meta_info[int].meta_value);
				tempJson.id = meta_info[int].id;
				$scope.companyArray.push(tempJson);
				
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
	  
	  $scope.deleteMeta = function(id){
		  dataFactory.deleteUserMeta($rootScope.user.id,id)
		  			 .success(function(res){
		  				getUserMeta('experience');
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
	getUserMeta('skill');
	function getUserMeta(meta_key){
		$scope.skillArray = [];
		dataFactory.getSpecificUserMeta(meta_key,$rootScope.user.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				var tempJson = JSON.parse(meta_info[int].meta_value);
				tempJson.id =  meta_info[int].id;
				$scope.skillArray.push(tempJson);
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
	    	answer.endorsedby = 0; //initialize the value by 0. Will increment when others endorse the user
	    	dataFactory.setSpecificUserMeta('skill',answer,$rootScope.user.id)
	    			   .success(function(data){
	    				   getUserMeta('skill');
	    			   });
	    }, function() {
	    });
	  };
	  
	  $scope.deleteMeta = function(id){
		  dataFactory.deleteUserMeta($rootScope.user.id,id)
		  			 .success(function(res){
		  				getUserMeta('skill');
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
		  if(answer != null){
			  $mdDialog.hide(answer);
			  $scope.error = "";  
		  }
	  };
	}


function convertTimestampToDate(timestamp){
	var d = new Date(timestamp);
	return d.toDateString() + " " + d.toLocaleTimeString();
}