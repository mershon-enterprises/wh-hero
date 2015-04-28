angular.module('hydra.transmitters', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.transmitters', {
                url: "/transmitters",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitters.tmpl.html",
                        controller: 'TransmittersCtrl as transmittersCtrl'
                    }
                }
            })
    })
    .controller('TransmittersCtrl', function(){
        var transmittersCtrl = this;

        var count = 1;
        transmittersCtrl.transmitters = _.map(
            window.parser.getTransmitterList(),
            function(t) {
                return {
                    id: count++,
                    connected: t['status'] === 208,
                    name: t['name'],
                    mac: t['macAddress']
                };
            }
        );
    });
