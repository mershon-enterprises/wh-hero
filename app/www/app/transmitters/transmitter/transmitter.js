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
        transmitterCtrl.transmitter = {
            name: 'Transmitter ' + id,
            pv: 1.23,
            sv: 4.56,
            tv: 7.89,
            qv: 10.11
        }

        transmitterCtrl.isConnected = true;
        transmitterCtrl.transmitterId = $stateParams.transmitterId;

    });