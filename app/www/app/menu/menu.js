angular.module('hero.menu', [])

    .controller('MenuCtrl', function($scope, $timeout) {
        var menuCtrl = this;

        menuCtrl.eraseData = function() {
            if (window.parser !== undefined) {
                window.parser.resetData();
                console.log('data erased...');
            }
        };
    })
