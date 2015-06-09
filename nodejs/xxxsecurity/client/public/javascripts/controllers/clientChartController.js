xxxsecurity.controller("ChartController", function($scope,DataService,$rootScope,$window) {
  $scope.loadData = function(){
    var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/alert/chart";
    DataService.getData(URI,[]).success(function(response){
      console.log("getData Alerts :" + JSON.stringify(response.data));
      var data = response.data;
      $scope.alertData = data;
      var cleanData = [];
      cleanData.push(['Date','Alerts']);
      data.forEach(function(element,index,array){
        cleanData.push([element.date, element.count]);
      });
      
      var data = google.visualization.arrayToDataTable(cleanData);
        var options = {
          title: '',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart'));

        chart.draw(data, options);
      getBillData(function(billInfo){
        $scope.billInfo = billInfo;
      });

    }).error(function(err){
      console.log(err);
    });
  }

  /**function to get bill data**/
  function getBillData(callback) {

    var URI = urlConstants.CLIENT + $window.sessionStorage.person_id +"/bill";

    DataService.getData(URI,[]).success(function(response){
      console.log("getData Contracts :" + JSON.stringify(response.data));
      $scope.billTableData = response.data;
      callback(response.data);
    }).error(function(err){

    });

  }

});

