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

                var width = 500,
                    height = 500;

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .nodes(d3.values(scope.data.nodes))
                    .links(scope.data.links)
                    .size([width, height])
                    .linkDistance(60)
                    .charge(-300)
                    .on("tick", tick)
                    .start();

                var svg = d3.select(elem[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var link = svg.selectAll(".link")
                    .data(force.links())
                    .enter().append("line")
                    .attr("class", "link");

                var node = svg.selectAll(".node")
                    .data(force.nodes())
                    .enter().append("g")
                    .attr("class", "node")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .call(force.drag);

                node.append("circle")
                    .attr("r", 6)
                    .style("fill", function(d) { return color(d.group); });

                node.append("text")
                    .attr("x", 12)
                    .attr("dy", ".35em")
                    .attr("font-size", "14px")
                    .attr("stroke", "#222")
                    .attr("stroke-width", "1")
                    .text(function(d) { return d.name; });

                function tick() {
                    link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                }

                function mouseover() {
                    d3.select(this).select("circle").transition()
                        .duration(750)
                        .attr("r", 12);
                }

                function mouseout() {
                    d3.select(this).select("circle").transition()
                        .duration(750)
                        .attr("r", 6);
                }

            }
        }
    });