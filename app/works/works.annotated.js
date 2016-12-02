'use strict';

angular.module('myApp.works', ['ngRoute', 'thatisuday.ng-image-gallery'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/works', {
    templateUrl: 'works/works.html',
    controller: 'WorksCtrl',
    reloadOnSearch: false
  });
}])
.config(['ngImageGalleryOptsProvider', function(ngImageGalleryOptsProvider){
    ngImageGalleryOptsProvider.setOpts({
        thumbnails  :   false,   
        inline      :   true,
        imgBubbles  :   false, 
        bgClose     :   true,
        bubbles     :   true, 
        imgAnim     :   'fadeup',
    });
}])

.controller('WorksCtrl', ['$scope',  function($scope)
 {
	$scope.posters = [
	    {
	        title : 'Poster Image - The Missing Parts Present: Sueños',
	        alt : 'Poster for The Missing Parts CD Release: Sueños',
	        url : '/img/CD-Release-Flyer.jpg',
	    },
	    {
	        title : 'Poster Image - The Missing Parts and Le Chat Lunatique',
	        alt : 'Poster for The Missing Parts and Le Chat Lunatique at Sister Bar',
	        url : '/img/Band-Automata-Flyer-at-Sister-with-Le-Chat.jpg',
	    },
	    {
	        title : 'Poster Image - The Missing Parts and Molehill Orkestrah',
	        alt : 'Poster for The Missing Parts and Molehill Orkestrah at Plush',
	        url : '/img/Molehill.jpg',
	    },
	    {
	        title : 'Poster Image - The Missing Parts and Maedea',
	        alt : 'Poster for The Missing Parts and Maedea at Solar Culture',
	        url : '/img/Poster-with-Maedea.jpg',
	    },
	    {
	        title : 'Poster Image - Globe',
	        alt : 'Poster for The Missing Parts',
	        url : '/img/Globe.jpg',
	    },
	];
	$scope.sculpture = [
	    {
	        title : 'Sculpture - Fractal Hand',
	        alt : 'Cast Aluminum Hand Fractal',
	        url : '/img/hand-sculpture.jpg',
	    },
	    {
	        title : 'Sculpture - Nautilus Origami Lamp',
	        alt : 'Nautilus Origami Lamp',
	        url : '/img/Nautilus.jpg',
	    },
	    {
	        title : 'Guitar Stand',
	        alt : 'Guitar Stand',
	        url : '/img/GuitarStand.jpg',
	    },
	    {
	        title : 'Sculpture - Egg Walker',
	        alt : 'Bronze Mechanical Egg',
	        url : '/img/egg-walker.jpg',
	    }
	];
}]);

