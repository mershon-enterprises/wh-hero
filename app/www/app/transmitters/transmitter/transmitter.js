angular.module('hydra.transmitters.transmitter', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.transmitters.transmitter', {
                url: "/transmitters/transmitter/:transmitterId",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitter/transmitter.tmpl.html",
                        controller: 'TransmitterCtrl as TransmitterCtrl'
                    }
                }
            })
    })
    .controller('TransmitterCtrl', function(){
        var transmitterCtrl = this;
    });