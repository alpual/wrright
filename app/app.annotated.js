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
  'thatisuday.ng-image-gallery'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  /*when('/works', {
    templateUrl: '/works/works.html',
    controller: 'WorksCtrl',
    reloadOnSearch: false
  }).*/
  otherwise({
  	redirectTo: '/view1'
  });
  // use the HTML5 History API
}]);


