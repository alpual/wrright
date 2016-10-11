'use strict';

angular.module('myApp.works', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/works', {
    templateUrl: 'works/works.html',
    controller: 'WorksCtrl'
  });
}])

.controller('WorksCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('json/works.json').success(function(data) {
    	$scope.entries = data.entries;
  	});
}]);

