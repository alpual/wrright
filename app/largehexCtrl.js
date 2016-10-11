'use strict';

var mobileMenu = angular.module("myApp.largehex", ["largehex-directive"]);
mobileMenu.controller('largehexCtrl',['$scope',function($scope){
    $scope.checked = false;
    $scope.size = '40px';
    $scope.toggle = function() {
        $scope.checked = !$scope.checked
    }
    $scope.mockRouteChange = function () {
        $scope.$broadcast('$locationChangeStart');
    }
    $scope.onopen = function () {
        alert('Open');
    }
    $scope.onclose = function () {
        alert('Close');
    }
}]);