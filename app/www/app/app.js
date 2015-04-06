// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('hydra', [
    'ionic',
    'hydra.menu',
    'hydra.dashboard',
    'hydra.mesh',
    'hydra.transmitters',
    'hydra.transmitters.transmitter'
])

.run(function($ionicPlatform) {
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

        var success = function(message) {
            alert(message);
        }
        var failure = function() {
            alert("Error calling Hello Plugin");
        }
        window.hello.greet("World", success, failure);
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('hydra', {
        url: "",
        abstract: true,
        templateUrl: "app/menu/menu.tmpl.html",
        controller: 'MenuCtrl as menuCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dashboard');
});
