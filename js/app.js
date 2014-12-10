(function(){
    var app = angular.module('order', []);

    app.controller('FormController', function($scope, $http, $filter) {

        // Constants //
        this.TAX_RATE = 0.0675;
        this.BASE_URL = "http://peaceful-beyond-1028.herokuapp.com/" // root of the api

        // Attributes //
        var form = this;

        this.styles = [];
        this.sizes = [];
        this.prebuilt_available = false; // is prebuilt available by default? Can be changed by api call.
        this.finishable = false; // is a finish selection availaable by default? Can be changed by api call.
        this.features = ['Deluxe', 'Premier', 'Vinyl']; // available types of features
        this.noFeature = ['Porch', 'Porch 12/12 Pitch', 'Leanto']; // these styles don't have a feature selection
        this.hasMaximum = [ // these range-input components have a max value associated with them
            {name: "Roof Pitch", max: 9},
        ];
        this.base_price = 0;
        this.totals = {};
        this.options = {
            style: '',
            size: '',
            feature: '',
            zone: 0,
            build_type: '',
            finish: '',
        }; // base options that get populated by user's selections in first section
        this.additions = [];
        this.section = 0; // currently displayed section
        this.hasAcknowledgedBaseChangeWarning = false;


        // Methods //

        this.isSelected = function(checkSection) {
            return this.section === checkSection;
        };
        this.nextSection = function() {
            if (!form.additions.length)
                return; // don't do anything if there are no addition sections
            this.section++;
            window.scroll(0, 0); // scroll to the top of the page
        };
        this.selectSection = function(setSection) {
            this.section = setSection;
        };
        this.displaySize = function(size) {
            if (size) return size.width + "x" + size.len;
        };
        this.requiresFeature = function(style) {
            for (var i = 0; i < this.noFeature.length; i++) {
                if (style === this.noFeature[i])
                    return false;
            }
            return true;
        };
        this.confirmBaseChange = function($event) {
            if (form.validBaseOptions() && !form.hasAcknowledgedBaseChangeWarning) {
                var ok = confirm("You are about to modify this structure's base options. Doing so will reset any options currently selected in subsequent sections of the form.\n\nAre you sure you wish to proceed?");
                if (ok)
                    form.hasAcknowledgedBaseChangeWarning = true;
                else
                    $event.preventDefault();
            }
        };
        this.validBaseOptions = function() {
            if (!this.options.style.length || !this.options.size || !this.options.zone) {
                console.log('missing style or size or zone');
                return false; // everything has to have these options
            }
            if (this.prebuilt_available && !this.options.build_type.length) {
                console.log('missing build type');
                return false;
            }
            if (this.finishable && !this.options.finish.length) {
                console.log('missing finish');
                return false;
            }
            if (this.requiresFeature(this.options.style) && !this.options.feature.length) {
                console.log('missing feature');
                return false;
            }
            return true;
        };
        this.displayPrice = function(component){
            if (component.price === 0)
                return;
            var types = {
                'sq_ft': 'sq. ft.',
                'ln_ft': 'ln. ft.',
                'each': 'ea.',
                'percent': '%'
            };
            var formatted_currency = $filter('currency')(component.price, "$");
            if (types.hasOwnProperty(component.pricing_type)) {
                if (component.pricing_type === 'percent')
                    return "[" + component.price + "%]";
                else {
                    return "[" + formatted_currency + " /" + types[component.pricing_type] + "]";
                }
            }
            else return "[" + formatted_currency + "]";
        };
        this.getAdditions = function() {
            $http.jsonp(form.BASE_URL + 'new_components/?callback=JSON_CALLBACK', {params: {len: form.options.size.len, width: form.options.size.width, style: form.options.style, feature: form.options.feature}}).success(function(data){
                form.additions = data;
                form.calculatePrice();
            });
        };
        this.calculatePrice = function() {
            $http.post(form.BASE_URL + 'calculate_price/', {data: {options: form.options, additions: form.additions}}).success(function(data){
                form.totals = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
        this.addCustomField = function(components, index) {
            components.splice(index+1, 0, {
                price: 0,
                options: [],
                form_type: "text",
                duplicate: true,
                // use the same properties as the first element (which comes from the API) for the following
                name: components[index].name,
                pricing_type: components[index].pricing_type
            });
        };
        this.deleteCustomField = function(components, index) {
            components.splice(index, 1);
        };
        this.getMaximum = function(component) {
            // if the passed component has a minimum, return it
            var name = component.name.toLowerCase();
            for (var i = 0; i < form.hasMaximum.length; i++) {
                if (name === form.hasMaximum[i].name.toLowerCase())
                    return form.hasMaximum[i].max;
            }
            return;
        };
        this.submit = function() {
            alert('form submitted');
        };

        $http.jsonp(form.BASE_URL + 'styles/?callback=JSON_CALLBACK').success(function(data){
            form.styles = data;
        })
        .error(function(data, status, headers, config){
            console.log(data);
        });


        // Watches //

        $scope.$watch(
            function(scope) { return form.options.style },
            function() {
                $http.jsonp(form.BASE_URL + 'sizes/?callback=JSON_CALLBACK', {params: {style: form.options.style}}).success(function(data){
                    form.sizes = data;
                });
            }
        );

        $scope.$watch(
            function(scope) { return form.options },
            function() {
                if (form.options.style.length && form.options.size && form.options.feature) {
                    $http.jsonp(form.BASE_URL + 'finishable/?callback=JSON_CALLBACK', {params: {style: form.options.style, width: form.options.size.width, len: form.options.size.len, feature: form.options.feature}}).success(function(data){
                        form.finishable = data;
                    });
                }
                if (form.validBaseOptions()) {
                    $http.jsonp(form.BASE_URL + 'prices/?callback=JSON_CALLBACK', {params: {style: form.options.style, width: form.options.size.width, len: form.options.size.len, feature: form.options.feature, zone: form.options.zone, build_type: form.options.build_type}}).success(function(data){
                        var total = data.base;
                        if (form.options.finish === 'paint')
                            total += parseInt(data.paint);
                        else if (form.options.finish === 'stain')
                            total += parseInt(data.stain);
                        form.base_price = total;
                        form.getAdditions();
                    })
                    .error(function(data){
                        console.log(data);
                    });
                }
            }, true // objectEquality http://stackoverflow.com/a/15721434
        );

        $scope.$watch(
            function(scope) { return form.options.size },
            function() {
                if (form.options.style.length) {
                    $http.jsonp(form.BASE_URL + 'prebuilt_available/?callback=JSON_CALLBACK', {params: {style: form.options.style, width: form.options.size.width, len: form.options.size.len}}).success(function(data){
                        form.prebuilt_available = data;
                        if (!form.prebuilt_available)
                            form.options.build_type = 'AOS';
                    });
                }
            }, true // objectEquality http://stackoverflow.com/a/15721434
        );

        $scope.$watch(
            function(scope) { return form.additions },
            form.calculatePrice,
            true // objectEquality http://stackoverflow.com/a/15721434
        );

    });

})();
