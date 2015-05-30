angular.module('hero.config', [

])
    .config(function($stateProvider) {
        $stateProvider
            .state('hero.config', {
                url: "/config",
                views: {
                    'menuContent': {
                        templateUrl: "app/config/config.tmpl.html",
                        controller: 'ConfigCtrl as configCtrl'
                    }
                }
            });
    })

    .controller('ConfigCtrl', function($cordovaToast) {
        var configCtrl = this;

        configCtrl.demoMode = false;
        configCtrl.hostIP = window.hostIP = [192, 168, 1, 10];
        configCtrl.applyIP = function() {
            window.hostIP = configCtrl.hostIP;
        };
        configCtrl.toggleDemoMode = function() {
            console.log('Toggling demo mode');
            if (configCtrl.demoMode && window.hart && window.parser) {
                configCtrl.hart = window.hart;
                configCtrl.parser = window.parser;
                delete window.hart;
                delete window.parser;
            } else if (!configCtrl.demoMode && configCtrl.hart && configCtrl.parser) {
                window.hart = configCtrl.hart;
                window.parser = configCtrl.parser;
                delete configCtrl.hart;
                delete configCtrl.parser;
            };
        };
    })
;

