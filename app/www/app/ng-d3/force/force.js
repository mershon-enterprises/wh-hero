/* global d3 */
angular.module('ng-d3.force', [])
    .directive('d3Force', function($timeout, $window) {
        return {
            restrict: 'E',
            replace: true,
            scope:  {
                data: "=data"
            },
            templateUrl: 'app/ng-d3/force/force.tmpl.html',
            link: function(scope, elem) {
                
                var color = d3.scale.category20();
                
                var width = $window.innerWidth,
                    height = $window.innerHeight * 0.5;
                
                var nodes = [],
                    links = [];

                var svg = d3.select(elem[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height); 
                
                var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([width, height])
                    .linkDistance(60)
                    .charge(-500)
                    .on("tick", tick)
                    .start();   
                
                var node = svg.selectAll(".node"),
                    link = svg.selectAll(".link");
                
                function start() {
                    $timeout(function() {
                        
                        link = link.data(force.links());
                        
                        link
                            .enter().append("line")
                            .attr("class", "link");
                            
                        link.exit().remove();
                        
                        node = node.data(force.nodes())
                            .attr("class", "node")
                            .call(force.drag);
                            
                        var nodeGroup = node.enter().append("g");
                        
                        nodeGroup
                            .append("circle")
                            .attr("id", function(d) { return "node-circle-" + d.id; })
                            .attr("r", 8)
                            .style("fill", function(d) { return d.selected ? "#CC0000" : color(d.group); });
                            
                        nodeGroup
                            .append("text")
                            .attr("id",function(d) { return "text-" + d.id; })
                            .attr("x", 16)
                            .attr("dy", ".35em")
                            .attr("font-size", "14px")
                            .attr("stroke", "#222")
                            .attr("stroke-width", "1")
                            .text(function(d) { return d.name; });
                            
                        node.exit().remove();
                        
                        force.start();
                    });
                    
                }
                
                function tick() {
                    node
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                }
                           
                scope.$watch('data', function (data) {

                        nodes.splice(0, nodes.length);
                        links.splice(0,links.length);
                    
                    for (var i = 0; i < data.nodes.length; i++)
                        nodes.push(data.nodes[i]);
                        
                    for (var i = 0; i < data.links.length; i++)
                        links.push(data.links[i]);
        
                    start();
                }, true);
                
            }
        }
    });