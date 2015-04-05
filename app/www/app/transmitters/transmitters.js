angular.module('hydra.transmitters', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.transmitters', {
                url: "/transmitters",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitters.tmpl.html",
                        controller: 'TransmittersCtrl as TransmittersCtrl'
                    }
                }
            })
    })
    .controller('TransmittersCtrl', function(){
        var transmittersCtrl = this;
    });