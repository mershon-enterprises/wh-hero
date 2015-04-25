angular.module('ng-d3', [])
    .directive('d3Line', function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope:  {
                options: "=options",
                data: "=data"
            },
            templateUrl: 'app/ng-d3/line/line.tmpl.html',
            link: function(scope, elem) {

                var chartWidth = scope.options.width - scope.options.margin.left - scope.options.margin.right,
                    chartHeight = scope.options.height - scope.options.margin.top - scope.options.margin.bottom;

                var x = d3.time.scale()
                    .range([0, chartWidth]);

                var y = d3.scale.linear()
                    .range([chartHeight, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(3)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.value); });

                var svg = d3.select(elem[0]).append("svg")
                    .attr("width", scope.options.width)
                    .attr("height", scope.options.height)
                    .append("g")
                    .attr("transform", "translate(" + scope.options.margin.left + "," + scope.options.margin.top + ")");




                scope.data.forEach(function(d) {
                    d.date = Date.parse(d.date);
                });
                x.domain(d3.extent(scope.data, function(d) { return d.date; }));
                y.domain(d3.extent(scope.data, function(d) { return d.value; }));

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + chartHeight + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end");

                svg.append("path")
                    .datum(scope.data)
                    .attr("class", "line")
                    .attr("d", line);

            }
        }
    });