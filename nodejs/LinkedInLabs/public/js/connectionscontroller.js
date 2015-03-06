var module = angular.module('frontpage');

module.controller('ConnectionsController', function($scope, $mdDialog, dataFactory, $rootScope){
	getUserConnections();
	function getUserConnections(){
		$scope.connectionArray = [];
		dataFactory.getUserConnections($rootScope.user.id).success(function(data){
			if(data.connectionsFound){
				for ( var int = 0; int < data.connections.length; int++) {
					data.connections[int].lastlogin = convertTimestampToDate(data.connections[int].lastlogin);
					data.connections[int].connectionsince = convertTimestampToDate(data.connections[int].connectionsince);
					$scope.connectionArray.push(data.connections[int]);
				}
			}else{
				$scope.connectionArray = [];
			}
		})
	}
});