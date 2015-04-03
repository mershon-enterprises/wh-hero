angular.module('hydra.menu', [])

    .controller('MenuCtrl', function($scope, $timeout) {
        var menuCtrl = this;

        menuCtrl.eraseData = function() {
            console.log('data erased...');
        };
    })
