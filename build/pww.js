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



;'use strict';

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

app.controller('preloadController', function($scope, preloader) {
     $scope.imageLocations = [
                    "img/LargeHex/LargeHexLogo.png",
                    "img/LargeHex/LargeHexAbout.png",
                    "img/LargeHex/LargeHexWorks.png",
                    "img/LargeHex/LargeHexContact.png",  
                    "img/SmallHexLogo.png",
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

});'use strict';

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
;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'));
    } else {
        factory(root.angular);
    }
}(this, function (angular) {

    angular
        .module('pageslide-directive', [])
        .directive('pageslide', ['$document', '$timeout', function ($document, $timeout) {
            var defaults = {};


            return {
                restrict: 'EA',
                transclude: false,
                scope: {
                    psOpen: '=?',
                    psAutoClose: '@',
                    psSide: '@',
                    psSpeed: '@',
                    psClass: '@',
                    psSize: '@',
                    psZindex: '@',
                    psPush: '@',
                    psContainer: '@',
                    psKeyListener: '@',
                    psBodyClass: '@',
                    psClickOutside: '@',
                    onopen: '=?',
                    onclose: '=?'
                },
                link: function ($scope, el, attrs) {

                    var param = {};

                    param.side = $scope.psSide || 'right';
                    param.speed = $scope.psSpeed || '0.5';
                    param.size = $scope.psSize || '300px';
                    param.zindex = $scope.psZindex || 1000;
                    param.className = $scope.psClass || 'ng-pageslide';
                    param.push = $scope.psPush === 'true';
                    param.container = $scope.psContainer || false;
                    param.keyListener = $scope.psKeyListener === 'true';
                    param.bodyClass = $scope.psBodyClass || false;
                    param.clickOutside = $scope.psClickOutside !== 'false';

                    param.push = param.push && !param.container;

                    el.addClass(param.className);

                    /* DOM manipulation */

                    var content, slider, body, isOpen = false;

                    if (param.container) {
                        body = document.getElementById(param.container);
                    } else {
                        body = document.body;
                    }

                    function onBodyClick(e) {
                        if(isOpen && !slider.contains(e.target)) {
                            isOpen = false;
                            $scope.psOpen = false;
                            $scope.$apply();
                        }

                        if($scope.psOpen) {
                            isOpen = true;
                        }
                    }

                    function setBodyClass(value){
                        if (param.bodyClass) {
                            var bodyClass = param.className + '-body';
                            var bodyClassRe = new RegExp(' ' + bodyClass + '-closed| ' + bodyClass + '-open');
                            body.className = body.className.replace(bodyClassRe, '');
                            body.className += ' ' + bodyClass + '-' + value;
                        }
                    }

                    setBodyClass('closed');

                    slider = el[0];

                    if (slider.tagName.toLowerCase() !== 'div' &&
                        slider.tagName.toLowerCase() !== 'pageslide') {
                        throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');
                    }

                    if (slider.children.length === 0) {
                        throw new Error('You need to have content inside the <pageslide>');
                    }

                    content = angular.element(slider.children);

                    body.appendChild(slider);

                    slider.style.zIndex = param.zindex;
                    slider.style.position = 'fixed';
                    slider.style.transitionDuration = param.speed + 's';
                    slider.style.webkitTransitionDuration = param.speed + 's';
                    slider.style.height = param.size;
                    slider.style.transitionProperty = 'top, bottom, left, right';

                    if (param.push) {
                        body.style.position = 'absolute';
                        body.style.transitionDuration = param.speed + 's';
                        body.style.webkitTransitionDuration = param.speed + 's';
                        body.style.transitionProperty = 'top, bottom, left, right';
                    }

                    if (param.container) {
                        slider.style.position = 'absolute';
                        body.style.position = 'relative';
                        body.style.overflow = 'hidden';
                    }

                    function onTransitionEnd() {
                        if ($scope.psOpen) {
                            if (typeof $scope.onopen === 'function') {
                                $scope.onopen();
                            }
                        } else {
                            if (typeof $scope.onclose === 'function') {
                                $scope.onclose();
                            }
                        }
                    }

                    slider.addEventListener('transitionend', onTransitionEnd);

                    initSlider();

                    function initSlider() {
                        switch (param.side) {
                            case 'right':
                                slider.style.width = param.size;
                                slider.style.height = '100%';
                                slider.style.top = '0px';
                                slider.style.bottom = '0px';
                                slider.style.right = '0px';
                                break;
                            case 'left':
                                slider.style.width = param.size;
                                slider.style.height = '100%';
                                slider.style.top = '0px';
                                slider.style.bottom = '0px';
                                slider.style.left = '0px';
                                break;
                            case 'top':
                                slider.style.height = param.size;
                                slider.style.width = '100%';
                                slider.style.left = '0px';
                                slider.style.top = '0px';
                                slider.style.right = '0px';
                                break;
                            case 'bottom':
                                slider.style.height = param.size;
                                slider.style.width = '100%';
                                slider.style.bottom = '0px';
                                slider.style.left = '0px';
                                slider.style.right = '0px';
                                break;
                        }
                    }

                    function psClose(slider, param) {
                        switch (param.side) {
                            case 'right':
                                slider.style.right = "-" + param.size;
                                if (param.push) {
                                    body.style.right = '0px';
                                    body.style.left = '0px';
                                }
                                break;
                            case 'left':
                                slider.style.left = "-" + param.size;
                                if (param.push) {
                                    body.style.left = '0px';
                                    body.style.right = '0px';
                                }
                                break;
                            case 'top':
                                slider.style.top = "-" + param.size;
                                if (param.push) {
                                    body.style.top = '0px';
                                    body.style.bottom = '0px';
                                }
                                break;
                            case 'bottom':
                                slider.style.bottom = "-" + param.size;
                                if (param.push) {
                                    body.style.bottom = '0px';
                                    body.style.top = '0px';
                                }
                                break;
                        }

                        if (param.keyListener) {
                            $document.off('keydown', handleKeyDown);
                        }

                        if (param.clickOutside) {
                            $document.off('touchend click', onBodyClick);
                        }
                        isOpen = false;
                        setBodyClass('closed');
                        $scope.psOpen = false;
                    }

                    function psOpen(slider, param) {
                        switch (param.side) {
                            case 'right':
                                slider.style.right = "0px";
                                if (param.push) {
                                    body.style.right = param.size;
                                    body.style.left = '-' + param.size;
                                }
                                break;
                            case 'left':
                                slider.style.left = "0px";
                                if (param.push) {
                                    body.style.left = param.size;
                                    body.style.right = '-' + param.size;
                                }
                                break;
                            case 'top':
                                slider.style.top = "0px";
                                if (param.push) {
                                    body.style.top = param.size;
                                    body.style.bottom = '-' + param.size;
                                }
                                break;
                            case 'bottom':
                                slider.style.bottom = "0px";
                                if (param.push) {
                                    body.style.bottom = param.size;
                                    body.style.top = '-' + param.size;
                                }
                                break;
                        }

                        $scope.psOpen = true;

                        if (param.keyListener) {
                            $document.on('keydown', handleKeyDown);
                        }

                        if (param.clickOutside) {
                            $document.on('touchend click', onBodyClick);
                        }
                        setBodyClass('open');
                    }

                    function handleKeyDown(e) {
                        var ESC_KEY = 27;
                        var key = e.keyCode || e.which;

                        if (key === ESC_KEY) {
                            psClose(slider, param);

                            // FIXME check with tests
                            // http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply

                            $timeout(function () {
                                $scope.$apply();
                            });
                        }
                    }


                    // Watchers

                    $scope.$watch('psOpen', function(value) {
                        if (!!value) {
                            psOpen(slider, param);
                        } else {
                            psClose(slider, param);
                        }
                    });

                    $scope.$watch('psSize', function(newValue, oldValue) {
                        if (oldValue !== newValue) {
                            param.size = newValue;
                            initSlider();
                        }
                    });


                    // Events

                    $scope.$on('$destroy', function () {
                        if (slider.parentNode === body) {
                            if (param.clickOutside) {
                                $document.off('touchend click', onBodyClick);
                            }
                            body.removeChild(slider);
                        }

                        slider.removeEventListener('transitionend', onTransitionEnd);
                    });

                    if ($scope.psAutoClose) {
                        $scope.$on('$locationChangeStart', function() {
                            psClose(slider, param);
                        });
                        $scope.$on('$stateChangeStart', function() {
                            psClose(slider, param);
                        });
                    }

                }
            };
        }]);
}));
;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'));
    } else {
        factory(root.angular);
    }
}(this, function (angular) {

    angular
        .module('tilehex-directive', [])
        .directive('tilehex', ['$animate', '$document', '$timeout', function ($animate, $document, $timeout) {

            return {
                restrict: 'A',
                transclude: false,
                scope: {
                    cardinality: '@',
                    defaultSrc: '@',
                    hoverSrc: '@',
                    hexSize: '@', 
                    hexClass: '@',
                    rotateTime: '@',
                    screenSize: '@'

                },
                controller: function($scope){

                },
                link: function ($scope, el, attrs) {

                    var param = {};

                    param.hexSize = $scope.hexSize || 'medium';
                    param.cardinality = $scope.cardinality || 'false';
                    param.defaultSrc = $scope.defaultSrc || 'false'; // if we want an alternate image when off hover
                    param.hoverSrc = $scope.hoverSrc || 'false';
                    param.className = $scope.hexClass || 'tilehex';
                    param.rotateTime = $scope.rotateTime || 3000;
                    param.screenSize = $scope.screenSize || 'all'; // format "min-width x" "max-width x" or "all" inclusive
                    param.imageFlash = $scope.imageFlash || false;


                    el.addClass(param.className);
                    el.addClass('hex');
                    el.addClass(param.hexSize);

                    el.addClass("hex-fade-in");
                    el.addClass("hex-fade-in-enter");
                    
                    setTimeout(function(){
                        /* Fade in animation */                        
                        el.removeClass("hex-fade-in-enter");
                    }, 20);



                    console.log(el);
                    /* DOM manipulation */


                    /* 
                     * Screen Width
                     * Check to see if the hex should rotate through images at the current screen size.
                     * uses parameter screenSize. Skip this if size is set to 'all'.
                     * set defaults and bind function handleWidth() on window resize
                     */
                    var theWidth, currentWidth, stopRotate = false;
                    if (param.screenSize != 'all'){
                        if( param.screenSize.indexOf('min-width') >= 0) {
                            // set minimum screen size 
                            handleWidth('min');
                            angular.element(window).bind('resize', handleWidth);
                            console.log("bind min");
                        }
                        if( param.screenSize.indexOf('max-width') >= 0) {
                            // set maximum screen size 
                            handleWidth('max');
                            angular.element(window).bind('resize', handleWidth);
                            console.log("bind max");
                        }
                    }

                    /*
                     * HANDLE WIDTH
                     * called to determine if a user-supplied max or min width has been surpassed
                     * stops image rotation if outside of user defined range
                     */
                    function handleWidth(){
                        var mode = param.screenSize.indexOf('max-width') >= 0 ? 'max' : 'min';
                        theWidth = param.screenSize.split(' ')[1];
                        currentWidth = window.innerWidth;
                        console.log("current width " + currentWidth + " compare to theWidth: " + theWidth);
                        if(mode == 'min' && currentWidth <= theWidth || mode == 'max' && currentWidth >= theWidth){
                            stopRotate = true;
                        } else {
                            stopRotate = false;
                        }
                    }

                    /*
                     * CARDINALITY
                     * Add Cardinality class if given.
                     * north, south, east and west are valid
                     * sets the cardinality as a class so that applicable css styles apply
                     * styles visible in hex.scss
                     */
                    if(param.cardinality) {

                        el.addClass(param.cardinality + "Hex"); // class northHex, eastHex etc...
                    }
                    /* 
                     * HOVER
                     * add hover source for image to display on hover.
                     * note that hover is not supported for hex galleries
                     * of rotating images.
                     */
                    if (param.hoverSrc != 'false'){
                        /* If we were given an image source for hover */
                        param.theSrc = el[0].children[0].src;

                        console.log(param.theSrc)
                        el.bind('mouseover', function(){
                            el[0].children[0].src = param.hoverSrc; /* set the image source on mouseover */
                        });

                        if (param.defaultSrc != 'false') { /* if a default source was set, it will revert to the default after the first hover */
                            el.bind('mouseout', function(){
                                el[0].children[0].src = param.defaultSrc;       
                            });
                        } else{ /* if no default was set, use whatever is the source of the first child, which should be an image */
                            el.bind('mouseout', function(){
                                el[0].children[0].src = param.theSrc;       
                            });
                        }
                        $animate.on('enter', el, function(el){

                            el[0].children[0].src = param.hoverSrc;

                        })
                    }
                    /*
                     * GALLERY 
                     * Add gallery functionality for multiple hex images fading in and out.
                     * uses parameter rotateTime if set.  Default 3000ms
                     * calls rotate()
                     */
                    if (el[0].children.length > 1) /* if we have multiple images as children within the tileHex */
                    {
                        var childList = [el[0].children[0]];
                        var theChildren = el[0].children;
                        if (param.imageFlash) {
                             for(var i = 1; i < theChildren.length; i++) { 
                                var theChild = theChildren[i];
                                theChild.className = "inPlace";
                             }
                        } else {
                            for(var i = 1; i < theChildren.length; i++) { /* hide everybody but the first child , index 0, which remains visible */
                                var theChild = theChildren[i];
                                theChild.className = "hidden";
                                childList.push(theChild); // add the new children to the childList
                            }  
                            setInterval(function(){ return rotate(); }, param.rotateTime); // switch images periodically.                          
                        }
                    }

                    /*
                     * ROTATE
                     * utility function rotate is called to switch the images in the hex.
                     * will switch back to defaultSrc if stopRotate is set to true
                     * stopRotate is set based on the window innerWidth in function handleWidth()
                     */
                    var childId = 0;
                    function rotate(){
                        if( stopRotate ){
                            if (param.defaultSrc != 'false'){
                                el[0].children[childId].className = 'gone';
                                el[0].children[0].className = 'opacityA';
                            }
                            return;
                        }
                        el[0].children[childId].className = "opacityZ"; //opacity zero
                        var prevChildId = childId;
                        childId ++;
                        if (childId == el.children.length)
                            childId = 0;
                        /* Now we have the next child and the previous child */
                        setTimeout(function(){
                            el[0].children[prevChildId].className = "gone"; // opacity and height 0
                            el[0].children[childId].className = "opacityA"; // opacity 1
                        }, 180);
                    }

                    /*
                     * CLEANUP
                     * clean up our event handler... don't want this getting too weird
                     */
                    cleanUp = function () {
                        window.angular.element(window).off('resize', handleWidth);
                    };
                    $scope.$on('$destroy', cleanUp)
                   

                }
            };
        }]);
}));
;'use strict';

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
}]);;angular
    .module('myApp')
    .factory(
            "preloader",
            function( $q, $rootScope ) {
                // I manage the preloading of image objects. Accepts an array of image URLs.
                function Preloader( imageLocations ) {
                    // I am the image SRC values to preload.
                    this.imageLocations = imageLocations;
                    // As the images load, we'll need to keep track of the load/error
                    // counts when announing the progress on the loading.
                    this.imageCount = this.imageLocations.length;
                    this.loadCount = 0;
                    this.errorCount = 0;
                    // I am the possible states that the preloader can be in.
                    this.states = {
                        PENDING: 1,
                        LOADING: 2,
                        RESOLVED: 3,
                        REJECTED: 4
                    };
                    // I keep track of the current state of the preloader.
                    this.state = this.states.PENDING;
                    // When loading the images, a promise will be returned to indicate
                    // when the loading has completed (and / or progressed).
                    this.deferred = $q.defer();
                    this.promise = this.deferred.promise;
                }
                // ---
                // STATIC METHODS.
                // ---
                // I reload the given images [Array] and return a promise. The promise
                // will be resolved with the array of image locations.
                Preloader.preloadImages = function( imageLocations ) {
                    var preloader = new Preloader( imageLocations );
                    return( preloader.load() );
                };
                // ---
                // INSTANCE METHODS.
                // ---
                Preloader.prototype = {
                    // Best practice for "instnceof" operator.
                    constructor: Preloader,
                    // ---
                    // PUBLIC METHODS.
                    // ---
                    // I determine if the preloader has started loading images yet.
                    isInitiated: function isInitiated() {
                        return( this.state !== this.states.PENDING );
                    },
                    // I determine if the preloader has failed to load all of the images.
                    isRejected: function isRejected() {
                        return( this.state === this.states.REJECTED );
                    },
                    // I determine if the preloader has successfully loaded all of the images.
                    isResolved: function isResolved() {
                        return( this.state === this.states.RESOLVED );
                    },
                    // I initiate the preload of the images. Returns a promise.
                    load: function load() {
                        // If the images are already loading, return the existing promise.
                        if ( this.isInitiated() ) {
                            return( this.promise );
                        }
                        this.state = this.states.LOADING;
                        for ( var i = 0 ; i < this.imageCount ; i++ ) {
                            this.loadImageLocation( this.imageLocations[ i ] );
                        }
                        // Return the deferred promise for the load event.
                        return( this.promise );
                    },
                    // ---
                    // PRIVATE METHODS.
                    // ---
                    // I handle the load-failure of the given image location.
                    handleImageError: function handleImageError( imageLocation ) {
                        this.errorCount++;
                        // If the preload action has already failed, ignore further action.
                        if ( this.isRejected() ) {
                            return;
                        }
                        this.state = this.states.REJECTED;
                        this.deferred.reject( imageLocation );
                    },
                    // I handle the load-success of the given image location.
                    handleImageLoad: function handleImageLoad( imageLocation ) {
                        this.loadCount++;
                        // If the preload action has already failed, ignore further action.
                        if ( this.isRejected() ) {
                            return;
                        }
                        // Notify the progress of the overall deferred. This is different
                        // than Resolving the deferred - you can call notify many times
                        // before the ultimate resolution (or rejection) of the deferred.
                        this.deferred.notify({
                            percent: Math.ceil( this.loadCount / this.imageCount * 100 ),
                            imageLocation: imageLocation
                        });
                        // If all of the images have loaded, we can resolve the deferred
                        // value that we returned to the calling context.
                        if ( this.loadCount === this.imageCount ) {
                            this.state = this.states.RESOLVED;
                            this.deferred.resolve( this.imageLocations );
                        }
                    },
                    // I load the given image location and then wire the load / error
                    // events back into the preloader instance.
                    // --
                    // NOTE: The load/error events trigger a $digest.
                    loadImageLocation: function loadImageLocation( imageLocation ) {
                        var preloader = this;
                        // When it comes to creating the image object, it is critical that
                        // we bind the event handlers BEFORE we actually set the image
                        // source. Failure to do so will prevent the events from proper
                        // triggering in some browsers.
                        var image = $( new Image() )
                            .on("load",
                                function( event ) {
                                    // Since the load event is asynchronous, we have to
                                    // tell AngularJS that something changed.
                                    $rootScope.$apply(
                                        function() {
                                            preloader.handleImageLoad( event.target.src );
                                            // Clean up object reference to help with the
                                            // garbage collection in the closure.
                                            preloader = image = event = null;
                                        }
                                    );
                                }
                            )
                            .on("error",
                                function( event ) {
                                    // Since the load event is asynchronous, we have to
                                    // tell AngularJS that something changed.
                                    $rootScope.$apply(
                                        function() {
                                            preloader.handleImageError( event.target.src );
                                            // Clean up object reference to help with the
                                            // garbage collection in the closure.
                                            preloader = image = event = null;
                                        }
                                    );
                                }
                            )
                            .prop( "src", imageLocation )
                        ;
                    }
                };
                // Return the factory instance.
                return( Preloader );
            }
        );;'use strict';

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
}]);;'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);;'use strict';

angular.module('myApp.works', ['ngRoute', 'thatisuday.ng-image-gallery'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/works', {
    templateUrl: 'works/works.html',
    controller: 'WorksCtrl'
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

.controller('WorksCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('json/works.json').success(function(data) {
    	$scope.entries = data.entries;
  	});

	$scope.images = [
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
	];
}]);

;'use strict';

angular.module('myApp.contact', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contact', {
    templateUrl: 'contact/contact.html',
    controller: 'ContactCtrl'
  });
}])

.controller('ContactCtrl', ['$scope', '$http', function($scope, $http) {

}]);

;!function(){"use strict";var e={enter:13,esc:27,left:37,right:39};angular.module("thatisuday.ng-image-gallery",["ngAnimate"]).provider("ngImageGalleryOpts",function(){var e={thumbnails:!0,inline:!1,bubbles:!0,imgBubbles:!1,bgClose:!1,imgAnim:"fadeup"};return{setOpts:function(i){angular.extend(e,i)},$get:function(){return e}}}).directive("ngImageGallery",["$rootScope","$timeout","$q","ngImageGalleryOpts",function(i,n,a,g){return{replace:!0,transclude:!1,restrict:"AE",scope:{images:"=",methods:"=?",conf:"=?",thumbnails:"=?",inline:"=?",bubbles:"=?",imgBubbles:"=?",bgClose:"=?",imgAnim:"@?",onOpen:"&?",onClose:"&?"},template:'<div class="ng-image-gallery img-move-dir-{{imgMoveDirection}}" ng-class="{inline:inline}"><div ng-if="thumbnails && !inline" class="ng-image-gallery-thumbnails"><div class="thumb" ng-repeat="image in images" ng-click="methods.open($index);" ng-style="{ \'background-image\': \'url(\' + (image.thumbUrl || image.url) + \')\' }"  ng-attr-title="{{image.title || undefined}}"></div></div><div class="ng-image-gallery-modal" ng-show="opened" ng-cloak><div class="ng-image-gallery-backdrop" ng-if="!inline"></div><div class="ng-image-gallery-content" ng-show="!imgLoading" ng-click="backgroundClose($event);"><div class="destroy-icons-container"><a class="ext-url" ng-repeat="image in images" ng-if="activeImg == image && image.extUrl" href="{{image.extUrl}}"></a><div class="close" ng-click="methods.close();" ng-if="!inline"></div></div><div class="prev" ng-click="methods.prev();" ng-class="{\'bubbles-on\':bubbles}" ng-hide="images.length == 1"></div><div class="next" ng-click="methods.next();" ng-class="{\'bubbles-on\':bubbles}" ng-hide="images.length == 1"></div><div class="galleria"><div class="galleria-images img-anim-{{imgAnim}} img-move-dir-{{imgMoveDirection}}"><img class="galleria-image" ng-repeat="image in images" ng-if="activeImg == image" ng-src="{{image.url}}" ondragstart="return false;" oncontextmenu="return false;" ng-attr-title="{{image.title || undefined}}" ng-attr-alt="{{image.alt || undefined}}"/></div><div class="galleria-bubbles" ng-if="bubbles && !imgBubbles"  ng-hide="images.length == 1"><span class="galleria-bubble" ng-click="setActiveImg(image);" ng-repeat="image in images" ng-class="{active : (activeImg == image)}"></span></div><div class="galleria-bubbles" ng-if="bubbles && imgBubbles" ng-hide="images.length == 1"><span class="galleria-bubble img-bubble" ng-click="setActiveImg(image);" ng-repeat="image in images" ng-class="{active : (activeImg == image)}" ng-style="{ \'background-image\': \'url(\' + (image.bubbleUrl || image.thumbUrl || image.url) +\')\' }"></span></div></div></div><div class="ng-image-gallery-loader" ng-show="imgLoading"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div></div></div>',link:function(l,s,t){l.showLoader=function(){l.imgLoading=!0},l.hideLoader=function(){l.imgLoading=!1},l.loadImg=function(e){if(!e)return a.reject();var i=a.defer();e.hasOwnProperty("cached")||l.showLoader();var n=new Image;return n.src=e.url,n.onload=function(){return e.hasOwnProperty("cached")||l.hideLoader(),e.hasOwnProperty("cached")||(e.cached=!0),i.resolve(e)},i.promise},l.setActiveImg=function(e){l.images.indexOf(l.activeImg)-l.images.indexOf(e)==l.images.length-1||l.images.indexOf(l.activeImg)-l.images.indexOf(e)<=0&&l.images.indexOf(l.activeImg)-l.images.indexOf(e)!=-(l.images.length-1)?l.imgMoveDirection="forward":l.imgMoveDirection="backward",l.loadImg(e).then(function(e){l.activeImg=e})},l.images=void 0!=l.images?l.images:[],l.methods=void 0!=l.methods?l.methods:{},l.conf=void 0!=l.conf?l.conf:{},l.$watchCollection("conf",function(e){l.thumbnails=void 0!=e.thumbnails?e.thumbnails:void 0!=l.thumbnails?l.thumbnails:g.thumbnails,l.inline=void 0!=e.inline?e.inline:void 0!=l.inline?l.inline:g.inline,l.bubbles=void 0!=e.bubbles?e.bubbles:void 0!=l.bubbles?l.bubbles:g.bubbles,l.imgBubbles=void 0!=e.imgBubbles?e.imgBubbles:void 0!=l.imgBubbles?l.imgBubbles:g.imgBubbles,l.bgClose=void 0!=e.bgClose?e.bgClose:void 0!=l.bgClose?l.bgClose:g.bgClose,l.imgAnim=void 0!=e.imgAnim?e.imgAnim:void 0!=l.imgAnim?l.imgAnim:g.imgAnim}),l.onOpen=void 0!=l.onOpen?l.onOpen:angular.noop,l.onClose=void 0!=l.onClose?l.onClose:angular.noop;var o=!0;l.$watch("images",function(){o?o=!1:l.images.length&&l.setActiveImg(l.images[l.activeImageIndex||0])});var m=!0;if(l.$watch("activeImageIndex",function(e){m?m=!1:l.images.length&&l.setActiveImg(l.images[e])}),l.$watch("inline",function(){n(function(){l.inline&&l.methods.open()})}),l.methods.open=function(e){l.activeImageIndex=e?e:0,l.opened=!0,l.inline||angular.element(document.body).addClass("body-overflow-hidden"),n(function(){l.onOpen()},300)},l.methods.close=function(){l.opened=!1,angular.element(document.body).removeClass("body-overflow-hidden"),n(function(){l.onClose(),l.activeImageIndex=0},300)},l.methods.next=function(){l.activeImageIndex==l.images.length-1?l.activeImageIndex=0:l.activeImageIndex=l.activeImageIndex+1},l.methods.prev=function(){0==l.activeImageIndex?l.activeImageIndex=l.images.length-1:l.activeImageIndex--},l.backgroundClose=function(e){if(l.bgClose&&!l.inline)for(var i=["galleria-image","destroy-icons-container","ext-url","close","next","prev","galleria-bubble"],n=0;n<e.target.classList.length&&i.indexOf(e.target.classList[n])==-1;n++)l.methods.close()},angular.element(document).bind("keyup",function(i){l.inline||(i.which==e.right||i.which==e.enter?n(function(){l.methods.next()}):i.which==e.left?n(function(){l.methods.prev()}):i.which==e.esc&&n(function(){l.methods.close()}))}),window.Hammer){var c=new Hammer(s[0]);c.on("swiperight",function(e){n(function(){l.methods.prev()})}),c.on("swipeleft",function(e){n(function(){l.methods.next()})}),c.on("doubletap",function(e){l.inline||n(function(){l.methods.close()})})}var d=function(){angular.element(document.body).removeClass("body-overflow-hidden")};i.$on("$stateChangeSuccess",d),i.$on("$routeChangeSuccess ",d)}}}])}();
//# sourceMappingURL=ng-image-gallery.min.js.map
