'use strict';

var mobileMenu = angular.module("myApp.tilehex", ["tilehex-directive"]);
mobileMenu.controller('tilehexCtrl',['$scope',function($scope){
    $scope.rotateTime = "300";
    /*
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
    }/**/
}]);