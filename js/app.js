(function(){
    var app = angular.module('order', []);

    app.controller('FormController', function($http) {
        this.options = {};

        this.section = 0;
        this.isSelected = function(checkSection) {
            return this.section === checkSection;
        };
        this.nextSection = function() {
            this.section++;
        };
        this.selectSection = function(setSection) {
            this.section = setSection;
        };
    });


    app.directive('dimensions', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/dimensions.html"
        };
    });

    app.directive('doors', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/doors.html"
        };
    });

    app.directive('windows', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/windows.html"
        };
    });

    app.directive('cupolas', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/cupolas.html"
        };
    });

    app.directive('shelves', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/shelves.html"
        };
    });

    app.directive('lofts', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/lofts.html"
        };
    });

    app.directive('roof', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/roof.html"
        };
    });

    app.directive('paint', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/paint.html"
        };
    });

    app.directive('misc', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/misc.html"
        };
    });

    app.directive('summary', function() {
        return {
            restrict: 'A',
            templateUrl: "../views/summary.html"
        };
    });

})();
