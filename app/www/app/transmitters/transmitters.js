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
    .controller('TransmittersCtrl', function() {
        var transmittersCtrl = this;

        transmittersCtrl.transmitters = [
            {id: 0, connected: true, name: 'Transmitter 1', mac: '01-02-03-04-05-06'},
            {id: 1, connected: false, name: 'Transmitter 2', mac: '11-12-13-14-15-16'},
            {id: 2, connected: true, name: 'Transmitter 3', mac: '21-22-23-24-25-26'},
            {id: 3, connected: true, name: 'Transmitter 4', mac: '31-32-33'}
        ];
    });