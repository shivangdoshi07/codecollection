var module = angular.module('frontpage');

module.controller('ConnectionsController', function($scope, dataFactory, $rootScope){
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

module.controller('InvitesController', function($scope, dataFactory, $rootScope){
	getUserConnectionsInvites();
	
	$scope.acceptConnection = function(sender_id){
		dataFactory.acceptUserConnection(sender_id,$rootScope.user.id)
					.success(function(result){
						getUserConnectionsInvites();
					});
	}
	
	function getUserConnectionsInvites(){
		$scope.inviteArray = [];
		dataFactory.getUserConnectionsInvites($rootScope.user.id).success(function(data){
			if(data.invitesFound){
				for ( var int = 0; int < data.invites.length; int++) {
					data.invites[int].lastlogin = convertTimestampToDate(data.invites[int].lastlogin);
					data.invites[int].invitesenton = convertTimestampToDate(data.invites[int].invitesenton);
					$scope.inviteArray.push(data.invites[int]);
				}
			}else{
				$scope.connectionArray = [];
			}
		})
	}
});