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
	// Define some variables for the scope in view1
  $scope.rowClass = 'even'; 
  $scope.isLoading = true;
  $scope.percentLoaded = 0;
  $scope.pageClass='page-home';
}]);

app.controller('preloadController', ['$scope', 'preloader', function($scope, preloader) {
     $scope.imageLocations = [
                    "img/LargeHex/LargeHexLogo.png",
                    "img/LargeHex/LargeHexAbout.png",
                    "img/LargeHex/LargeHexWorks.png",
                    "img/LargeHex/LargeHexContact.png",  
                    "img/LargeHex/LargeHexAboutHover7.png",
                    "img/LargeHex/LargeHexLogoHover.png", 
                    "img/LargeHex/LargeHexWorksHover.png",   
                    "img/LargeHex/LargeHexContactHover2.png"

      ];
      // Preload the images; then, update display when returned.
     preloader.preloadImages( $scope.imageLocations ).then(
    function handleResolve( imageLocations ) {
          // Loading was successful.
          $scope.isLoading = false;
          $scope.isSuccessful = true;
          console.info( "Preload Successful" );
          angular.element('#preload-text').addClass("hidden");
          angular.element('.preloader').addClass("hidden");
      },
      function handleReject( imageLocation ) {
          // Loading failed on at least one image.
          $scope.isLoading = false;
          $scope.isSuccessful = false;
          console.error( "Image Failed", imageLocation );
          console.info( "Preload Failure" );
      },
      function handleNotify( event ) {
        $scope.percentLoaded = event.percent;
        console.info( "Percent loaded:", event.percent );
      }
  );

}])