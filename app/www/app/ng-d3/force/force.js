angular.module('ng-d3', [])
    .directive('d3Force', function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope:  {
                options: "=options",
                data: "=data"
            },
            templateUrl: 'app/ng-d3/force/force.tmpl.html',
            link: function(scope, elem) {

                var color = d3.scale.category20();

                var svg = d3.select(elem).append("svg")
                    .attr("width", scope.options.width)
                    .attr("height", scope.options.height);

                var force = d3.layout.force()
                    .charge(scope.options.charge)
                    .linkDistance(scope.options.linkDistance)
                    .size([scope.options.width, scope.options.height])
                    .nodes(scope.data.nodes)
                    .links(scope.data.links)
                    .start();

                var link = svg.selectAll(".link")
                    .data(scope.data.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

                var node = svg.selectAll(".node")
                    .data(scope.data.nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .style("fill", function(d) { return color(d.group); })
                    .call(force.drag);

                node.append("title")
                    .text(function(d) { return d.name; });

                force.on("tick", function() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });

                });

            }
        }
    });