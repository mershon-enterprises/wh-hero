angular.module('hero.transmitters.transmitter.measurementHistory', [
    'ng-d3.line'
])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.measurementHistory', {
                url: "/transmitters/transmitter/:macAddress/measurementHistory/:measurementName",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitter/measurementHistory/measurementHistory.tmpl.html",
                        controller: 'MeasurementHistoryCtrl as measurementHistoryCtrl'
                    }
                }
            })
    })
    .controller('MeasurementHistoryCtrl', function($stateParams, $state, TransmitterService, RecordService){
        var measurementHistoryCtrl = this;

        // if no transmitter macAddress provided, change state to hero.transmitters
        if ($stateParams.macAddress == '')
        {
            $state.go('hero.transmitters')
        }

        var macAddress = $stateParams.macAddress;

        // if no measurement name provdied, change state to the transmitter referenced by the macAddress
        if ($stateParams.measurementName == '')
        {
            $state.go('hero.transmitters', {macAddress: macAddress});
        }

        var measurementName = $stateParams.measurementName;

        var transmitter = TransmitterService.fetchByMacAddress(macAddress);
        var measurementHistory = RecordService.getTransmitterMeasurementHistory(macAddress, measurementName);

        measurementHistoryCtrl.measurementName = measurementName.toUpperCase();
        measurementHistoryCtrl.transmitter = transmitter;
        measurementHistoryCtrl.chartData = measurementHistory;
    });
