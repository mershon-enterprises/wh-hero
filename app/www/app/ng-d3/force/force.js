/* global d3 */
angular.module('ng-d3', [])
    .directive('d3Force', function($timeout, $window) {
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
                
                var width = $window.innerWidth,
                    height = $window.innerHeight * 0.5;

                var svg = d3.select(elem[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height); 
                
                var force = d3.layout.force()
                    .nodes(d3.values(scope.data.nodes))
                    .links(scope.data.links)
                    .size([width, height])
                    .linkDistance(60)
                    .charge(-300)
                    .on("tick", tick)
                    .start();     

                var link = svg.selectAll(".link")
                    .data(force.links())
                    .enter().append("line")
                    .attr("class", "link");

                var node = svg.selectAll(".node")
                    .data(force.nodes())
                    .enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);

                node.append("circle")
                    .attr("id", function(d) { return "node-circle-" + d.id; })
                    .attr("r", 8)
                    .style("fill", function(d) { return d.selected ? "#CC0000" : color(d.group); });

                node.append("text")
                    .attr("x", 16)
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
            
                    
                scope.$watch('data', function (data) {
                    console.log("watched");
                    svg.selectAll(".node").select("circle")
                        .transition()
                        .duration(300)
                        .style("fill", function(d) { return d.selected ? "#CC0000" : color(d.group); });

                }, true);

                
                function zoomIn() {
                    
                }
                
                function zoomOut() {
                    
                }
                
                scope.zoomIn = zoomIn;
                scope.zoomOut = zoomOut;

            }
        }
    });