(function(){
    var app = angular.module('order', []);

    // TODO: remove if this doesn't solve anything
    app.config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.controller('FormController', function($http) {
        var form = this;

        this.styles = [];
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

        $http.get('http://peaceful-beyond-1028.herokuapp.com/styles').success(function(data){
            form.styles = data;
            console.log(form.styles);
        })
        .error(function(data, status, headers, config){
            console.log(data);
        });
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
