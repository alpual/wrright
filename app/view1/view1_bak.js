'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
	$http.get('json/hexGrid.json').success(function(data) {
    	$scope.grid = data.grid;
    	$scope.hexRow = [];
    	var rows = data.grid.length;
  		for(var i = 0; i < rows; i++) {
  			$scope.hexRow[i] = {"hexes": [], "rowClass": "even"}
  			$scope.hexRow[i].hexes = data.grid[i];

        // cycle through all hexes in this row, used to initialize additional
        // variables in $scope.hexRow[i].hexes
        for(var j = 0; j < $scope.hexRow[i].hexes.length; j++){
          if ($scope.hexRow[i].hexes[j].hasOwnProperty('img'))
            $scope.hexRow[i].hexes[j].source = $scope.hexRow[i].hexes[j].img;
          else {
            $scope.hexRow[i].hexes[j].source = '';
            $scope.hexRow[i].hexes[j].img = '';
          }
        }
			$scope.hexRow[i].rowClass = (i % 2 == 0) ? 'even' : 'odd';
		}
  	});
  	//$scope.hello = "Hello There";
  	$scope.rowClass = 'even'; 
}]);
