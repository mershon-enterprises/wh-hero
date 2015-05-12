angular.module('hero.dashboard', [

])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "app/dashboard/dashboard.tmpl.html",
                        controller: 'DashboardCtrl as dashboardCtrl'
                    }
                }
            });
    })

    .controller('DashboardCtrl', function() {
        var dashboardCtrl = this;

        dashboardCtrl.lastUpdated = new Date();
        dashboardCtrl.isConnected = true;

        dashboardCtrl.connectivityMessage = "Connected";

        dashboardCtrl.toggleConnectivity = function() {
            if (dashboardCtrl.isConnected) {
                var disable = function() {
                    dashboardCtrl.isConnected = false;
                    dashboardCtrl.connectivityMessage = "Disconnected";
                }

                if (window.parser !== undefined) {
                    window.parser.disablePolling().then(
                        disable,
                        function() {
                            // error. inconceivable
                        }
                    );
                }
            } else {
                var enable = function() {
                    dashboardCtrl.isConnected = true;
                    dashboardCtrl.connectivityMessage = "Connected";
                    dashboardCtrl.lastUpdated = new Date();
                };

                if (window.parser !== undefined) {
                    // production
                    window.parser.enablePolling().then(
                        enable,
                        function(errorMessage) {
                            alert(errorMessage);
                        }
                    );
                } else {
                    // dev mode
                    enable();
                }

            }
        };
    })
;
