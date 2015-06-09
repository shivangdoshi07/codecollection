xxxsecurity.controller("AdminChartController", function($scope,DataService,$rootScope,$window) {
  $scope.alertData = [];
  $scope.loadAlertData = function(){
    
    DataService.getData(urlConstants.ALERT+'/chart',[]).success(function(response){
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

        var chart = new google.visualization.LineChart(document.getElementById('alertChart'));

        chart.draw(data, options);
      

    }).error(function(err){
      console.log(err);
    });
  }

  $scope.loadGuardData = function(){
    
    DataService.getData(urlConstants.GUARD+'/chart',[]).success(function(response){
      var data = response.data;
      console.log(data);
      var cleanData = [];
      cleanData.push(["Type", "Count"]);
      data.forEach(function(element,index,array){
        if(element.bg_status == "pending")
          cleanData.push(["Pending", element.count]);
        else{
          if(element.is_occupied == 0)
            cleanData.push(["Avaliable", element.count]);
          else
            cleanData.push(["Occupied", element.count]);
        }
      });

      var data = google.visualization.arrayToDataTable(cleanData);

        var options = {
          title: ''
        };

        var chart = new google.visualization.PieChart(document.getElementById('guards'));

        chart.draw(data, options);      

    }).error(function(err){
      console.log(err);
    });
  }

  $scope.loadBillData = function(){
    
    DataService.getData(urlConstants.GUARD+'/chart',[]).success(function(response){
      var data = response.data;
      console.log(data);
      var cleanData = [];
      cleanData.push(["Type", "Count"]);
      data.forEach(function(element,index,array){
        if(element.bg_status == "pending")
          cleanData.push(["Pending", element.count]);
        else{
          if(element.is_occupied == 0)
            cleanData.push(["Avaliable", element.count]);
          else
            cleanData.push(["Occupied", element.count]);
        }
      });

      var data = google.visualization.arrayToDataTable(cleanData);

        var options = {
          title: 'Guards Availability'
        };

        var chart = new google.visualization.PieChart(document.getElementById('guards'));

        chart.draw(data, options);      

    }).error(function(err){
      console.log(err);
    });
  }
});