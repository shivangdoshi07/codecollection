xxxsecurity.controller("DeleteGuardCtrl", function($scope,DataService,$window) {

    $scope.deleteGuard = function(guard_id) {

      var URI = urlConstants.GUARD + guard_id;

  		DataService.deleteData(URI,[]).success(function(response){
  			console.log(response);
          var index = -1;
          var guardarray = $scope.$parent.$data;
          console.log("guardarray : " + JSON.stringify(guardarray));
          for( var i = 0; i < guardarray.length; i++ ) {
                if( guardarray[i].person_id === guard_id ) {
                    index = i;
                    console.log("index : " + index);
                    break;
                }
          }
          if( index === -1 ) {
            $scope.$parent.alerts_guard.push({msg: 'Something gone wrong with removing from table'});
          }
          $scope.$parent.$data.splice( index, 1 );
      		}).error(function(err){
            //console.log("Error deleting record")
            $scope.$parent.alerts_guard.push({msg: 'Error occured while deleting guard'});
            //console.log("$scope.$parent.alerts_guard : " + JSON.stringify($scope.$parent.alerts));
      		});

  	};

});
