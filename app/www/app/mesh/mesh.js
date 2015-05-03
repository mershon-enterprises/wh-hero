angular.module('hydra.mesh', [
    'ui.bootstrap'
])
.config(function($stateProvider) {
        $stateProvider
            .state('hydra.mesh', {
                url: "/mesh",
                views: {
                    'menuContent': {
                        templateUrl: "app/mesh/mesh.tmpl.html",
                        controller: 'MeshCtrl as meshCtrl'
                    }
                }
            })
    })
.controller('MeshCtrl', function($stateParams, $state){

        var meshCtrl = this;
        
        var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        
        meshCtrl.states = states;
        
        meshCtrl.typeAheadTemplateUrl = "app/mesh/typeAhead.tmpl.html";

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

        var nodes = [
            {"id": 0, "name":"Transmitter 1","group":0},
            {"id": 1, "name":"Transmitter 2","group":1},
            {"id": 2, "name":"Transmitter 3","group":1},
            {"id": 3, "name":"Transmitter 4","group":1},
            {"id": 4, "name":"Transmitter 5","group":1},
            {"id": 5, "name":"Transmitter 6","group":1},
            {"id": 6, "name":"Transmitter 7","group":1},
            {"id": 7, "name":"Transmitter 8","group":1}
        ];
        var links = [
            {"source":0,"target":1,"value":1},
            {"source":0,"target":2,"value":1},
            {"source":0,"target":3,"value":1},
            {"source":1,"target":4,"value":1},
            {"source":3,"target":4,"value":1},
            {"source":3,"target":5,"value":1},
            {"source":4,"target":5,"value":1},
            {"source":4,"target":6,"value":1},
            {"source":5,"target":6,"value":1},
            {"source":6,"target":7,"value":1}

        ];
        var data = {
            nodes: nodes,
            links: links
        };

        var options = {
            height: 400,
            width: 400
        };

        var viewTransmitter = function(id)
        {
            $state.go('hydra.transmitter', {transmitterId: id})
        };

        meshCtrl.chartData = data;

        meshCtrl.chartOptions = options;


        /**
         * Note: Once the views are done, create a transmitterService.
         *       It should be stubbed out with static data, but it should still
         *       use local-storage to store the transmitter data.
         *       Use the transmitterId passed as a state param to fetch the
         *       transmitter from the service.
         */

    });