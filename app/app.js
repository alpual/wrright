'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.works',
  'myApp.contact',
  'myApp.pageslide',
  'myApp.tilehex',
  'ngAnimate', 
  'thatisuday.ng-image-gallery',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  otherwise({
  	redirectTo: '/view1'
  });
}]);



