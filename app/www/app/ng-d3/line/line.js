/* global angular */
/* global d3 */
angular.module('ng-d3.line', [])
    .directive('d3Line', function($timeout, $window) {
        return {
            restrict: 'E',
            replace: true,
            scope:  {
                data: "=data"
            },
            templateUrl: 'app/ng-d3/line/line.tmpl.html',
            link: function(scope, elem) {

                var width = $window.innerWidth,
                    height = $window.innerHeight * 0.5;


                    var chart = c3.generate({
                        bindto: elem[0],
                        data: {
                            json: scope.data,
                            keys: {
                                x: 'date',
                                value: ['value']
                            },
                            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
                            type: 'spline'
                        },
                        axis: {
                            x: {
                                type: 'timeseries',
                                tick: {
                                    format: '%H:%M:%S',
                                    culling: {
                                        max: 5
                                    }
                                }
                            },
                            y: {
                               tick: {
                                   format: d3.format('.2f')
                               }
                           }
                        }
                    });
            }
        }
    });
