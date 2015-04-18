angular.module('hydra.transmitters.transmitter.measurementHistory', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.measurementHistory', {
                url: "/transmitters/transmitter/:transmitterId/measurementHistory/:measurementId",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitter/measurementHistory/measurementHistory.tmpl.html",
                        controller: 'MeasurementHistoryCtrl as measurementHistoryCtrl'
                    }
                }
            })
    })
    .controller('MeasurementHistoryCtrl', function($stateParams, $state){
        var measurementHistoryCtrl = this;

        // if no transmitter id provided, change state to hydra.transmitters
        if ($stateParams.transmitterId == '')
        {
            $state.go('hydra.transmitters')
        }

        var transmitterId = $stateParams.transmitterId;

        if ($stateParams.measurementId == '')
        {
            $state.go('hydra.transmitters', {transmitterId: transmitterId});
        }

        var measurementId = $stateParams.measurementId;

        measurementHistoryCtrl.transmitter = {
            name: 'Transmitter ' + id,
            pv: 1.23,
            sv: 4.56,
            tv: 7.89,
            qv: 10.11
        };

        /**
         * Note: Once the views are done, create a transmitterService.
         *       It should be stubbed out with static data, but it should still
         *       use local-storage to store the transmitter data.
         *       Use the transmitterId passed as a state param to fetch the
         *       transmitter from the service.
         */

    });