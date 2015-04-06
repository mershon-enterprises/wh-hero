angular.module('hydra.mesh', [])
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
.controller('MeshCtrl', function(){

    });