angular.module('hydra.dashboard', [

])
    .config(function($stateProvider) {
        $stateProvider
            .state('hydra.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "app/dashboard/dashboard.tmpl.html",
                        controller: 'DashboardCtrl as dashboardCtrl'
                    }
                }
            })
    })

    .controller('DashboardCtrl', function() {
        var dashboardCtrl = this;

        dashboardCtrl.isConnected = true;

        dashboardCtrl.connectivityMessage = "Connected";

        dashboardCtrl.toggleConnectivity = function() {
            if (dashboardCtrl.isConnected) {
                dashboardCtrl.isConnected = false;
                dashboardCtrl.connectivityMessage = "Disconnected";
            } else {
                dashboardCtrl.isConnected = true;
                dashboardCtrl.connectivityMessage = "Connected";
            }
        };

        dashboardCtrl.playlists = [
            { title: 'Test', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })
;