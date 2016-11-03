'use strict';

var mobileMenu = angular.module("myApp.pageslide", ["pageslide-directive"]);
mobileMenu.controller('pageslideCtrl',['$scope',function($scope){
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