var module = angular.module('frontpage');
module.factory('dataFactoryPublic', ['$http', function($http) {

    var urlBase = '/api/user';
    var dataFactoryPublic = {};

    dataFactoryPublic.getUser = function (id) {
        return $http.get(urlBase + '/' + id);
    };
    
    dataFactoryPublic.getUserMeta = function (id) {
        return $http.get(urlBase + '/meta/' + id);
    };
    
    dataFactoryPublic.getSpecificUserMeta = function (meta,id) {
        return $http.get(urlBase + '/meta/'+ meta + '/' + id);
    };
    
    dataFactoryPublic.getConnection = function(node_1,node_2){
    	return $http.get(urlBase + '/connections/'+node_1+'/'+node_2);
    }
    
    dataFactoryPublic.setConnection = function(node_1,node_2){
    	return $http.post(urlBase + '/connections/'+node_1+'/'+node_2);
    }
/*    dataFactory.setSpecificUserMeta = function (meta_key,meta_value,id) {
        return $http.post(urlBase + '/meta/'+ meta_key + '/' + id,meta_value);
    };

    dataFactory.updateCustomer = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };*/

/*    dataFactory.deleteCustomer = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    dataFactory.getOrders = function (id) {
        return $http.get(urlBase + '/' + id + '/orders');
    };*/

    return dataFactoryPublic;
}]);
module.controller('PublicProfileController', function($scope, $rootScope, $routeParams, dataFactoryPublic) {
	$rootScope.publicuser = {};
	$rootScope.publicuser.id =  $routeParams.id;
	$scope.userdetails;
	$scope.usermeta;
	$scope.addConnection = function(){
		isConnection(); //call again to verify the they are not connections
		if(!$scope.isConnected && $rootScope.publicuser.id != $rootScope.user.id){
			makeConnection();
		}
	};
	getUserInfo();

	if($rootScope.publicuser.id == $rootScope.user.id){
		$scope.isConnected = true;
		$scope.isPending = false;
	}else{
		isConnection();
	}
		function getUserInfo(){
			dataFactoryPublic.getUser($rootScope.publicuser.id).success(function(info){
				$scope.userdetails = info[0];
				$scope.userdetails.lastlogin =convertTimestampToDate(info[0].timestamp);
			})
		}
		
		function isConnection(){
			$scope.isConnected = false;
			dataFactoryPublic.getConnection($rootScope.user.id,$rootScope.publicuser.id)
			.success(function(res){
				$scope.isConnected = res.isConnection;
				$scope.isPending = res.isPending;
				if(res.isPending)
					$scope.requestSendTimestamp = res.timestamp;
				console.log(res);
			});
		}
		
		function makeConnection(){
			dataFactoryPublic.setConnection($rootScope.user.id,$rootScope.publicuser.id)
			.success(function(res){
				$scope.isConnected = res.isConnection;
				$scope.isPending = res.isPending;
			});
		}
	});

module.controller('PublicSummaryController', function($scope, $mdDialog, dataFactoryPublic, $rootScope){
	getUserMeta('summary');
	function getUserMeta(meta_key){
		$scope.summaryArray = [];
		dataFactoryPublic.getSpecificUserMeta(meta_key,$rootScope.publicuser.id).success(function(meta_info){
			if(meta_info.length > 0){
				$scope.summaryArray.push(JSON.parse(meta_info[meta_info.length-1].meta_value));
			}	
		})
	}
});


module.controller('PublicEducationController', function($scope, $mdDialog, dataFactoryPublic, $rootScope){
	
	getUserMeta('education');
	function getUserMeta(meta_key){
		$scope.schoolArray = [];
		dataFactoryPublic.getSpecificUserMeta(meta_key,$rootScope.publicuser.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.schoolArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
});


module.controller('PublicExperienceController', function($scope, $mdDialog, dataFactoryPublic, $rootScope){
	getUserMeta('experience');
	function getUserMeta(meta_key){
		$scope.companyArray = [];
		dataFactoryPublic.getSpecificUserMeta(meta_key,$rootScope.publicuser.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.companyArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
});


module.controller('PublicSkillController', function($scope, $mdDialog, dataFactoryPublic, $rootScope){
	getUserMeta('skill');
	function getUserMeta(meta_key){
		$scope.skillArray = [];
		dataFactoryPublic.getSpecificUserMeta(meta_key,$rootScope.publicuser.id).success(function(meta_info){
			for ( var int = 0; int < meta_info.length; int++) {
				$scope.skillArray.push(JSON.parse(meta_info[int].meta_value));
				
			}
		})
	}
});


function convertTimestampToDate(timestamp){
	var d = new Date(timestamp);
	return d.toDateString() + " " + d.toLocaleTimeString();
}