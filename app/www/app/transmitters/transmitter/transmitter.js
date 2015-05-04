angular.module('hydra.transmitters.transmitter', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.transmitter', {
                url: "/transmitters/transmitter/:transmitterId",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitter/transmitter.tmpl.html",
                        controller: 'TransmitterCtrl as transmitterCtrl'
                    }
                }
            })
    })
    .controller('TransmitterCtrl', function($stateParams, $state){
        var transmitterCtrl = this;

        // if no transmitter id provided, change state to hydra.transmitters
        if ($stateParams.transmitterId == '')
        {
            $state.go('hydra.transmitters')
        }

        var id = $stateParams.transmitterId;
        var transmitter = window.parser.transmitters[id];
        var hartVariables = window.parser.hartVariables[transmitter['macAddress']];
        transmitterCtrl.transmitter = {
            name: transmitter['name'] + ' (' + transmitter['macAddress'] + ')',
            pv: hartVariables['pvValue'],
            sv: hartVariables['svValue'],
            tv: hartVariables['tvValue'],
            qv: hartVariables['qvValue']
        };
        transmitterCtrl.isConnected = transmitter['status'] == 208;
        transmitterCtrl.transmitterId = $stateParams.transmitterId;

        var viewHistory = function(measurementName)
        {
            $state.go('hydra.measurementHistory', {transmitterId: id, measurementId: measurementName})
        };
    });
