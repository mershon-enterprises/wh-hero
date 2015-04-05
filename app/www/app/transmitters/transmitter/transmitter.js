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

        transmitterCtrl.transmitterId = $stateParams.transmitterId;
    });