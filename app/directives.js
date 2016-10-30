'use strict';

(function () {

    var gridHexDirective = function ($animate) {
        return {
	        restrict: 'E', //E = element, A = attribute, C = class, M = comment         
	        /*templateUrl: 'hex.html',*/
	        template: function(scope, tElement, tAttrs) {
    			var s = "";
    			s += '<li>';
    			s += '<div  style="background-image: none"></div>';
    			s += '</li>';
    			return s;        	
	        },
	        replace: true,
	        //controller: controllerFunction, //Embed a custom controller in the directive
	        link: function (scope, element, attrs) {
                element.addClass('hex');
                element.addClass('small');   


                element.bind('mouseover', function(){
                    element.css('background-color', scope.x.color);
                    if(scope.x.imgHover != null)
                        element.children().first().css('background-image', 'url("' + scope.x.imgHover + '")');
                });
                element.bind('mouseout', function(){
                    element.css('background-color', '#fff');
                    element.children().first().css('background-image', 'none');
                });
                if (scope.x.details != null){
                    var popup = angular.element('<div class="ref"><span class="refbody refcenter hidden">' + scope.x.details + '</span></div>')
                    element.append(popup);
                }

            }
        };
    };
    
    /* directive alpual-ref
     *
     * based on the reference system used on xkcd's whatif
     * reference number appears as a hyperlink.  Upon clicking, a box appears with the
     * reference contents.  When the user clicks again (anywhere in the website body),
     * the reference box is again hidden.  
     *
     * uses css in the ref.scss file
     *
     * uses the form below, where X is the number of the reference in the page
     * <alpual-ref>
            <span class="refnum">[X]</span>
            <span class="refbody">The contents of the reference popup box</span>
        </alpual-ref>
     */
    var referenceDirective = function ($document) {
        return {
            restrict: 'EA', // usage <alpual-ref></alpual-ref>
            link: function (scope, element, attrs) {
                // This is here to avoid cluttering up the HTML
                element.addClass('ref');
                // Hide the body of the reference, refbody, which is the second child of 
                // the ref element
                element.children().first().next().addClass('hidden'); 
                // toggle the reference body's visibility when the reference is clicked
                element.bind('click', function($event){
                    // refbody is the second child of the element
                    element.children().first().next().toggleClass('hidden');
                    // we have to stop propagation to make sure this click doesn't trigger
                    // the next document.body click event
                    $event.stopPropagation();
                });
                // When the user clicks anywhere in the body of the website,
                // hide refbody, the second child of element
                angular.element($document[0].body).bind("click", function($event){
                    element.children().first().next().addClass('hidden');
                });                
            }
        }
    };
    
    var navLinks = function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            /*templateUrl: 'hex.html',*/
            templateUrl: '/nav.html',
            scope: {
                navSize: '@'
            },
            replace: true,
            link: function ($scope, element, attrs){
                var param = {};

                param.navClass = 'menu-' + $scope.navSize || '';
                element.addClass(param.navClass);
            }
        };
    };

    angular.module('myApp')
        .directive('alpualRef', referenceDirective);
    angular.module('myApp')
        .directive('gridHex', gridHexDirective);
    angular.module('myApp')
        .directive('navLinks', navLinks);

}());
