
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
                    
                    el.addClass(param.className);
                    el.addClass('hex');
                    el.addClass(param.hexSize);

                    el.addClass("hex-fade-in");
                    
                    setTimeout(function(){
                        /* Fade in animation */
                    // cause a reflow
                    el[0].offsetHeight; // ???
                   
                    el.addClass("hex-fade-in-active");
                        //el.addClass("hex-fade-in-active");
                        //el[0].offsetHeight; // ???
                        /*el.removeClass("hex-fade-in");
                        el.removeClass("hex-fade-in-active");/**/
                    }, 2000);

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
                        for(var i = 1; i < theChildren.length; i++) { /* hide everybody but the first child , index 0, which remains visible */
                            var theChild = theChildren[i];
                            theChild.className = "hidden";
                            childList.push(theChild); // add the new children to the childList
                        }  
                        setInterval(function(){ return rotate(); }, param.rotateTime); // switch images periodically.                          
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
