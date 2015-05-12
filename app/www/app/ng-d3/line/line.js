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
                            xFormat: '%Y-%m-%d %H:%M:%S',
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

//                var chart = c3.generate({
//                    bindto: elem[0],
//                    data: {
//                        type: "line",
//                        json: scope.data,
//                    },
//                    keys: {
//                        x: 'date',
//                        value: ['upload', 'download']
//                    },
//                    xFormat: '%Y-%m-%d %H:%M:%S',
//                    type: 'spline',
//                    axis: {
//                        x: {
//                            type: 'timeseries',
//                            tick: {
//                                format: '%m/%d %H:%M'
//                            }
//                        }
//                    },
//                    size: {
//                        height: height,
//                        width: width
//                    }
//                });
                
//                    
//                var chartWidth = width - 70,
//                    chartHeight = height - 50;
//
//                var x = d3.time.scale()
//                    .range([0, chartWidth]);
//
//                var y = d3.scale.linear()
//                    .range([chartHeight, 0]);
//
//                var xAxis = d3.svg.axis()
//                    .scale(x)
//                    .ticks(3)
//                    .orient("bottom");
//
//                var yAxis = d3.svg.axis()
//                    .scale(y)
//                    .orient("left");
//
//                var line = d3.svg.line()
//                    .x(function(d) { return x(d.date); })
//                    .y(function(d) { return y(d.value); });
//
//                var svg = d3.select(elem[0]).append("svg")
//                    .attr("width", width)
//                    .attr("height", height)
//                    .append("g")
//                    .attr("transform", "translate(50,20)"); //left,top
//
//
//
//
//                scope.data.forEach(function(d) {
//                    d.date = Date.parse(d.date);
//                });
//                x.domain(d3.extent(scope.data, function(d) { return d.date; }));
//                y.domain(d3.extent(scope.data, function(d) { return d.value; }));
//
//                svg.append("g")
//                    .attr("class", "x axis")
//                    .attr("transform", "translate(0," + chartHeight + ")")
//                    .call(xAxis);
//
//                svg.append("g")
//                    .attr("class", "y axis")
//                    .call(yAxis)
//                    .append("text")
//                    .attr("transform", "rotate(-90)")
//                    .attr("y", 6)
//                    .attr("dy", ".71em")
//                    .style("text-anchor", "end");
//
//                svg.append("path")
//                    .datum(scope.data)
//                    .attr("class", "line")
//                    .attr("d", line);

            }
        }
    });