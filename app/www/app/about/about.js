angular.module('hero.about', [

])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "app/about/about.tmpl.html",
                        controller: 'AboutCtrl as aboutCtrl'
                    }
                }
            });
    })

    .controller('AboutCtrl', function($cordovaToast) {
        //var aboutCtrl = this;
    })
;

