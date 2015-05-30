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

    .controller('DashboardCtrl', function($cordovaToast) {
        var dashboardCtrl = this;

        dashboardCtrl.lastUpdated = new Date();

        // start out disconnected
        dashboardCtrl.isConnected = false;
        dashboardCtrl.connectivityMessage = "Click to connect";

        dashboardCtrl.toggleConnectivity = function() {
            if (dashboardCtrl.isConnected) {
                var disable = function() {
                    dashboardCtrl.isConnected = false;
                    dashboardCtrl.connectivityMessage = "Click to connect";
                }

                if (window.parser !== undefined) {
                    window.parser.disablePolling().then(
                        disable,
                        function() {
                            // error. inconceivable
                        }
                    );
                } else {
                    // dev mode
                    disable();
                }
            } else {
                var enable = function() {
                    dashboardCtrl.isConnected = true;
                    dashboardCtrl.connectivityMessage = "Connected";
                    dashboardCtrl.lastUpdated = new Date();
                };

                if (window.parser !== undefined) {
                    // production
                    window.parser.enablePolling(
                        window.hostIP.join('.'),
                        5094
                    ).then(
                        enable,
                        function(errorMessage) {
                            $cordovaToast.show(errorMessage, 'long', 'center');
                        }
                    );
                } else {
                    // dev mode
                    enable();
                }

            }
        };

        // add an event hook for connectedToGateway
        document.addEventListener('connectedToGateway', function() {
            if (!dashboardCtrl.isConnected) {
                dashboardCtrl.toggleConnectivity();
            }
        });
    })
;
