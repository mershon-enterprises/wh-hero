angular.module('hero.transmitters.transmitter', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.transmitter', {
                url: "/transmitters/transmitter/:macAddress",
                views: {
                    'menuContent': {
                        templateUrl: "app/transmitters/transmitter/transmitter.tmpl.html",
                        controller: 'TransmitterCtrl as transmitterCtrl'
                    }
                }
            })
    })
    .controller('TransmitterCtrl', function($stateParams, $state, TransmitterService, RecordService){
        var transmitterCtrl = this;

        // if no transmitter macAddress provided, change state to hero.transmitters
        if ($stateParams.macAddress == '')
        {
            $state.go('hero.transmitters')
        }

        var macAddress = $stateParams.macAddress;

        var transmitterInfo = TransmitterService.fetchByMacAddress(macAddress);
        var transmitterData = RecordService.fetchMostRecentTransmitterData(macAddress);

        var transmitter;

        if (transmitterInfo === undefined) {
            transmitter = {
                name: undefined,
                data: transmitterData
            };
        } else {
            transmitter = {
                name: transmitterInfo.name,
                data: transmitterData
            };
        }
                
        var viewHistory = function(measurementName)
        {
            $state.go('hero.measurementHistory', {macAddress: macAddress, measurementName: measurementName})
        };

        transmitterCtrl.viewHistory = viewHistory;
        transmitterCtrl.transmitter = transmitter;

        transmitterCtrl.isConnected = true;

    });
