angular.module('hydra.transmitters.transmitter.measurementHistory', [
    'ng-d3'
])
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

        var transmitter = {
            name: 'Transmitter ' + $stateParams.transmitterId,
            measurements: [
                { date: '2015-04-25 09:15:13 AM', pv: 1.5, sv: 2.7, tv: 4.6, qv: 3.8 },
                { date: '2015-04-25 09:15:48 AM', pv: 1.6, sv: 2.4, tv: 4.4, qv: 3.9 },
                { date: '2015-04-25 09:16:14 AM', pv: 1.3, sv: 2.3, tv: 4.2, qv: 3.7 },
                { date: '2015-04-25 09:16:49 AM', pv: 1.4, sv: 2.6, tv: 4.8, qv: 3.5 },
                { date: '2015-04-25 09:17:15 AM', pv: 1.5, sv: 2.7, tv: 4.6, qv: 3.8 },
                { date: '2015-04-25 09:17:49 AM', pv: 1.6, sv: 2.4, tv: 4.4, qv: 3.9 },
                { date: '2015-04-25 09:18:16 AM', pv: 1.3, sv: 2.3, tv: 4.2, qv: 3.7 },
                { date: '2015-04-25 09:18:50 AM', pv: 1.4, sv: 2.6, tv: 4.8, qv: 3.5 }
            ]
        };

        var data = new Array();
        _.forEach(transmitter.measurements, function(m) {
           data.push({date: m.date, value: m[measurementId]});
        });

      var options = {
          margin: {top: 20, right: 20, bottom: 30, left: 50},
          height: 200,
          width: 300
      };

        measurementHistoryCtrl.chartData = data;

        measurementHistoryCtrl.chartOptions = options;


        /**
         * Note: Once the views are done, create a transmitterService.
         *       It should be stubbed out with static data, but it should still
         *       use local-storage to store the transmitter data.
         *       Use the transmitterId passed as a state param to fetch the
         *       transmitter from the service.
         */

    });