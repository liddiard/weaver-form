(function(){
    var app = angular.module('order', []);

    // TODO: remove if this doesn't solve anything
    app.config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.controller('FormController', function($scope, $http) {
        var form = this;

        this.styles = [];
        this.sizes = [];
        this.features = ['Deluxe', 'Premier', 'Vinyl'];
        this.base_prices = {};
        this.options = {
            style: '',
            size: '',
            feature: '',
            zone: 0,
            build_type: '',
            finish: '',
        };

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
        this.displaySize = function(size) {
            if (size) return size.width + "x" + size.length;
        }

        $http.jsonp('http://peaceful-beyond-1028.herokuapp.com/styles/?callback=JSON_CALLBACK').success(function(data){
            form.styles = data;
        })
        .error(function(data, status, headers, config){
            console.log(data);
        });

        $scope.$watch(
            function(scope) { return form.options.style },
            function() {
                $http.jsonp('http://peaceful-beyond-1028.herokuapp.com/sizes/?callback=JSON_CALLBACK', {params: {style: form.options.style}}).success(function(data){
                    form.sizes = data;
                });
            }
        );

        $scope.$watch(
            function(scope) { return form.options },
            function() {
                if (form.options.style.length && form.options.feature.length && form.options.zone && form.options.build_type.length && form.options.finish.length) {
                    $http.jsonp('http://peaceful-beyond-1028.herokuapp.com/treatment_price/?callback=JSON_CALLBACK', {params: {style: form.options.style, width: form.options.size.width, length: form.options.style['length'], feature: form.options.feature, zone: form.options.zone, build_type: form.options.build_type}}).success(function(data){
                        console.log(data);
                    });
                }
            }, true // objectEquality http://stackoverflow.com/a/15721434
        );
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
