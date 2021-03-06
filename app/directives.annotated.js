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

                /* this function shows the hex image, used on hover and to show the hex when the 
                   details are being displayed
                */ 
                function alpualSmallHexImg(){
                    //console.log("smallHexImg");
                    element.css('background-color', scope.x.color);
                    if(scope.x.imgHover != null)
                        element.children().first().css('background-image', 'url("' + scope.x.imgHover + '")');
                    if(scope.x.details != null) {
                        element.addClass('highlight-hex');
                    }
                }
                function alpualHideSmallHex(){
                     //console.log (scope.x);
                    if (!element.hasClass('popped')){
                        element.css('background-color', '#fff');
                        element.children().first().css('background-image', 'none');
                    }
                    element.removeClass('highlight-hex');
                }
                function lightboxClose(){
                    /*var refBox = angular.element(document.getElementById('#refBox'));
                    var refBoxBackground = angular.element(document.getElementById('#refBoxBackground'));
                    var closeIcon = angular.element(document.getElementById('#close-icon'));

                    refBox.addClass('hidden');
                    refBoxBackground.addClass('hidden');
                    closeIcon.addClass('hidden');*/
                    
                    
                    $('#refBox').addClass('hidden');
                    $('#refBoxBackground').addClass('hidden');
                    $('#close-icon').addClass('hidden');

                    //console.log ("Element: " + element);
                    element.removeClass('popped');
                    element.css('background-color', '#fff');
                    element.children().first().css('background-image', 'none');
                    element.removeClass('highlight-hex');
                }
                scope.closeLightBoxWithEsc = lightboxClose;

                element.bind('mouseover', alpualSmallHexImg);
                element.bind('mouseout', alpualHideSmallHex);
                if (scope.x.details != null){
                    var popup = angular.element( scope.x.details)
                    scope.x.popup = popup;
                    element.bind('click', function(){
                        //console.log ("Element: " + element);
                        element.toggleClass('popped');
                        $('#refBox').html(scope.x.popup);
                        $('#refBox').toggleClass('hidden popped');
                        var refImgWidth = $('#refBox img').width();
                        $('#refBox p').css('max-width', refImgWidth);
                        $('#refBoxBackground').toggleClass('hidden');
                        $('#refBoxBackground').bind("mousedown", lightboxClose);
                        $('#refBoxBackground').bind("touchstart", lightboxClose);
                        $('#close-icon').toggleClass('hidden'); 
                        $('#close-icon').bind('click', lightboxClose);
                    });
                }

            }
        };
    };
    gridHexDirective.$inject = ['$animate'];

    app.directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress keyup", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEsc);
                    });

                    event.preventDefault();
                }
            });
        };
    });
    
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
    referenceDirective.$inject = ['$document'];
    
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
