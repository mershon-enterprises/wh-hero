angular.module('hero.transmitters', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.transmitters', {
                url: "/transmitters",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitters.tmpl.html",
                        controller: 'TransmittersCtrl as transmittersCtrl'
                    }
                }
            });
    })
    .controller('TransmittersCtrl', function(TransmitterService) {
        var transmittersCtrl = this;
        transmittersCtrl.transmitters = TransmitterService.getAll();
    });
