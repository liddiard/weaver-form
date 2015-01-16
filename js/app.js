(function(){
    var app = angular.module('order', []);

    app.controller('FormController', function($scope, $http, $filter) {

        // Constants //

        this.BASE_URL = "http://peaceful-beyond-1028.herokuapp.com/" // root of the api
        this.TAX_RATE = 0.0675; // right now, this isn't being used in calculations, only for display at the bottom of the sidebar


        // Attributes //
        var form = this;

        this.styles = []; // filled in by /styles api call
        this.sizes = [];  // filled in by /sizes api call
        this.prebuilt_available = false; // is prebuilt available by default? Modified by /prebuilt_available api call.
        this.features = ['Deluxe', 'Premier', 'Vinyl']; // available types of features (hardcoded)
        this.noFeature = ['Porch', 'Porch 12/12 Pitch', 'Leanto']; // these styles don't have a feature selection (hardcoded)
        this.base_price = 0; // base price of this barn. Modified by /prices api call.
        this.totals = {}; // total price breakdown, populated by /calculate_price. Displayed in sidebar.
        this.options = {
            style: '',
            size: '',
            feature: '',
            zone: 0,
            build_type: '',
            finish: '',
        }; // base options that get populated by user's selections in first section
        this.additions = []; // huge array of additions that gets populated by /new_components api call.
        this.fees = { // TODO: this is planned to be a last screen in which the salesperson can
                      // manually input sales tax, delivery fees, discounts, etc.
                      // this data is sent back with /calculate_price api call.
            sales_tax: 0,
            delivery: 0,
            advanced: {
                percent: 0,
                price: 0
            }
        };
        this.section = 0; // currently displayed section
        this.hasAcknowledgedBaseChangeWarning = false; // has the user already acknowledged a
            // warning to changing the form's base options? see "confirmBaseChange" method below.
        this.visualEditorOpen = false; // is the visual editor currently being displayed?


        // Methods //

        this.isSelected = function(checkSection) {
            // is the passed section currently being displayed? returns true/false
            return this.section === checkSection;
        };
        this.nextSection = function() {
            // move to the next section sequentially
            if (!form.additions.length)
                return; // don't do anything if there are no additional sections
            this.section++;
            window.scroll(0, 0); // scroll to the top of the page
        };
        this.selectSection = function(setSection) {
            // move to a specific section
            this.section = setSection;
        };
        this.displaySize = function(size) {
            // format a size object for display
            if (size) return size.width + "x" + size.len;
        };
        this.aspectRatio = function() {
            // return the aspect ratio of the selected barn dimensions
            return form.options.size.width / form.options.size.len;
        }
        this.requiresFeature = function(style) {
            // does this style of barn require a feature selection? returns true/false
            for (var i = 0; i < this.noFeature.length; i++) {
                if (style === this.noFeature[i])
                    return false;
            }
            return true;
        };
        this.confirmBaseChange = function($event) {
            // pop up a confirmation dialog to confirm that the user is making a
            // change to the barn's base options which will require reloading
            // form additions, thereby clearing their current selection of additions.
            if (form.validBaseOptions() && !form.hasAcknowledgedBaseChangeWarning) {
                var ok = confirm("You are about to modify this structure's base options. Doing so will reset any options currently selected in subsequent sections of the form.\n\nAre you sure you wish to proceed?");
                if (ok)
                    form.hasAcknowledgedBaseChangeWarning = true;
                else
                    $event.preventDefault();
            }
        };
        this.validBaseOptions = function() {
            // checks if the base options a user has selected on the first screen
            // are valid. returns true/false.
            if (!this.options.style.length || !this.options.size || !this.options.zone) {
                console.log('missing style or size or zone');
                return false; // everything has to have these options
            }
            if (this.prebuilt_available && !this.options.build_type.length) {
                console.log('missing build type');
                return false;
            }
            if (this.requiresFeature(this.options.style) && !this.options.feature.length) {
                console.log('missing feature');
                return false;
            }
            return true;
        };
        this.displayPrice = function(component, index){
            // format the price for a component or an option to display
            /* If you're passing a component that has options, you must pass an
            *  index parameter for the index of the option for which you want
            *  to display the price.
            */

            var price;
            if (typeof component.options !== 'undefined' && component.options.length)
                price = component.options[index].price;
            else
                price = component.price;

            if (price === 0)
                return; // don't display anything if price is zero

            var types = {
                'sq_ft': 'sq. ft.',
                'ln_ft': 'ln. ft.',
                'each': 'ea.',
                'percent': '%'
            };

            var formatted_currency = $filter('currency')(price, "$");
            if (types.hasOwnProperty(component.pricing_type)) {
                if (component.pricing_type === 'percent')
                    return "[" + price + "%]";
                else {
                    return "[" + formatted_currency + " /" + types[component.pricing_type] + "]";
                }
            }
            else return "[" + formatted_currency + "]";
        };
        this.getAdditions = function() {
            // get form additions using the user's base options selection.
            // assigns a successful response to the form.additions variable
            // and makes an additional call to form.calculatePrice.
            var params = {
                len: form.options.size.len,
                width: form.options.size.width,
                style: form.options.style,
                feature: form.options.feature
            };
            $http.jsonp(form.BASE_URL + 'new_components/?callback=JSON_CALLBACK', {params: params}).success(function(data){
                form.additions = data;
                form.calculatePrice();
            });
        };
        this.calculatePrice = function() {
            // calculate the price of the given base options, additions, and fees.
            // this price data is displayed in the sidebar.
            var params = {
                options: form.options,
                additions: form.additions,
                fees: form.fees
            };
            $http.post(form.BASE_URL + 'calculate_price/', {data: params}).success(function(data){
                form.totals = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
        this.addCustomField = function(components, index) {
            // add a new custom field text box immediately after the previous custom field
            components.splice(index+1, 0, {
                price: 0,
                quantity: 0,
                options: [],
                form_type: "text",
                duplicate: true,
                // use the same properties as the first element (which comes from the API) for the following
                name: components[index].name,
                pricing_type: components[index].pricing_type
            });
        };
        this.deleteCustomField = function(components, index) {
            // remove custom field at index
            components.splice(index, 1);
        };
        this.incrementRange = function(component, key) {
            // increase the value of component[key] by one and add an image
            // to the visual editor if applicable
            var max = component.max || Infinity;
            var value = component[key] || 0;
            if (value < max) {
                component[key] = value + 1;
                if (component.image_url) form.pushImage(component);
            }
        };
        this.decrementRange = function(component, key) {
            // decrease the value of component[key] by one and remove an image
            // to the visual editor if applicable
            var min = component.min || 0;
            var value = component[key] || 0;
            if (value > min) {
                component[key] = value - 1;
                if (component.image_url) form.popImage(component);
            }
        };
        this.pushImage = function(component) {
            // append an image to a component
            if (!component.images)
                component.images = [];
            component.images.push({
                placed: false,
                top: 0,
                right: 0,
                rotation: 0,
            });
        };
        this.popImage = function(component) {
            // remove a component's last image
            component.images.pop();
        };
        this.deleteImage = function(component, index) {
            // remove a component's image at a specific index
            component.images.splice(index, 1);
        };
        this.rotateImage = function(component, index) {
            // increase the rotation of an image by one 90-degree increment
            component.images[index].rotation++;
        };
        this.submit = function() {
            // TODO: implement
            alert('form submitted');
        };
        this.getPrices = function(success_callback) {
            // if the base options a user has selected are valid, get the price
            // of said base selection. optionally executes a callback function on
            // successful response.
            if (form.validBaseOptions()) {
                var params = {
                    style: form.options.style,
                    width: form.options.size.width,
                    len: form.options.size.len,
                    feature: form.options.feature,
                    zone: form.options.zone,
                    build_type: form.options.build_type
                };
                $http.jsonp(form.BASE_URL + 'prices/?callback=JSON_CALLBACK', {params: params}).success(function(data){
                    var total = data.base;
                    if (form.options.finish === 'paint')
                        total += data.paint;
                    else if (form.options.finish === 'stain')
                        total += data.stain;
                        form.base_price = total;
                        form.getAdditions();
                    if (typeof success_callback === 'function')
                        success_callback();
                })
                .error(function(data){
                    console.log(data);
                });
            }

        };

        this.removeInitialFormChange = function() {
            // clear the watch on all base options of the form and instantiate a
            // new watch on solely the feature and style keys of the base options.
            $scope.$watch(
                function(scope) { return form.options.feature + form.options.style },
                form.getPrices
            );
            clearAllBaseOptionsWatch();
        }

        // get the initial barn styles on page load
        $http.jsonp(form.BASE_URL + 'styles_with_images/?callback=JSON_CALLBACK').success(function(data){
            form.styles = data;
        })
        .error(function(data, status, headers, config){
            console.log(data);
        });


        // Watches //

        // watch for changes in the form style selection to load/reload appropriate barn sizes.
        $scope.$watch(
            function(scope) { return form.options.style },
            function() {
                $http.jsonp(form.BASE_URL + 'sizes/?callback=JSON_CALLBACK', {params: {style: form.options.style}}).success(function(data){
                    form.sizes = data;
                });
            }
        );

        // watch for changes in the form base options to get the appropriate base price.
        var clearAllBaseOptionsWatch = $scope.$watch(
            function(scope) { return form.options },
            function(){form.getPrices(form.removeInitialFormChange)}, true // objectEquality http://stackoverflow.com/a/15721434
                                        // "form.removeInitialFormChange" is a success callback
        );

        // watch for changes in the barn size to get whether or not a prebuilt
        // option is available for the new barn size.
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

        // watch for changes to the form's additions and recalculate the price
        $scope.$watch(
            function(scope) { return form.additions },
            form.calculatePrice,
            true // objectEquality http://stackoverflow.com/a/15721434
        );

        // watch for changes to the form's fees and recalculate the price
        $scope.$watch(
            function(scope) { return form.fees },
            form.calculatePrice,
            true // objectEquality http://stackoverflow.com/a/15721434
        );

    });

})();
