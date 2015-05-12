var hero = angular.module('hero', [
    'ionic',
    'hero.menu',
    'hero.dashboard',
    'hero.mesh',
    'hero.transmitters',
    'hero.transmitters.transmitter',
    'hero.transmitters.transmitter.measurementHistory'
])

.run(function($ionicPlatform, $q) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova &&
            window.cordova.plugins &&
            window.cordova.plugins.Keyboard
        ) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        if (!window.tlantic.plugins.socket) {
            alert('No object window.tlantic.plugins.socket!');
        }

        // Make 'q' module available to Cordova plugins
        window.$q = $q;

        // start parsing immediately
        if (window.parser !== undefined) {
            window.parser.enablePolling();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('hero', {
        url: "",
        abstract: true,
        templateUrl: "app/menu/menu.tmpl.html",
        controller: 'MenuCtrl as menuCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dashboard');
});
