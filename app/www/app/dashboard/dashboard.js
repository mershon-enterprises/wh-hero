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

        dashboardCtrl.lastUpdated = new Date();
        dashboardCtrl.isConnected = true;

        dashboardCtrl.connectivityMessage = "Connected";

        dashboardCtrl.toggleConnectivity = function() {
            if (dashboardCtrl.isConnected) {
                dashboardCtrl.isConnected = false;
                dashboardCtrl.connectivityMessage = "Disconnected";
            } else {
                dashboardCtrl.isConnected = true;
                dashboardCtrl.connectivityMessage = "Connected";
                dashboardCtrl.lastUpdated = new Date();
            }
        };
    })
;