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
        window.gateway = null;
        window.hart.connect(
          '192.168.1.12', 5094
        ).then(
          function() {
            return window.hart.login();
          },
          function(message) {
            alert('Failed to connect to Gateway!');
          }
        ).then(
          function(loginResponse) {
            return window.hart.getGateway();
          },
          function(message) {
            alert('Failed to login to Gateway!');
          }
        ).then(
          function(gateway) {
            window.gateway = gateway;
            return window.hart.getGatewayDeviceCount(window.gateway);
          },
          function(message) {
            alert('Failed to call getGateway');
          }
        ).then(
          function(deviceCount) {
            alert(deviceCount + ' transmitters in Gateway');
          },
          function(message) {
            alert('Failed to call getDGatewayDeviceCount');
          }
        );

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
