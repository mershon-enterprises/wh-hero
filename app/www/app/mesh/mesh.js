angular.module('hero.mesh', [
    'ui.bootstrap',
    'ng-d3.force'
])
.config(function($stateProvider) {
        $stateProvider
            .state('hero.mesh', {
                url: "/mesh",
                views: {
                    'menuContent': {
                        templateUrl: "app/mesh/mesh.tmpl.html",
                        controller: 'MeshCtrl as meshCtrl'
                    }
                }
            })
    })
.controller('MeshCtrl', function($stateParams, $state, TransmitterService){

        var meshCtrl = this;

        var transmitters = TransmitterService.getAll().concat(
            // add the gateway as a node for things to connect to
            { connected: true,
               name:      'Gateway',
               mac:       'Gateway',
               neighbors: []
            }
        );
        
        function populateNodes()
        {
            var nodeMap = {};
            var nodes = [];
            var allNodes = [];
            var links = [];
            var dL = {}; // discoveredLinks
            
            // create node objects from transmitters by adding the "group" and "selected" properties
            // create a map from mac to node
            var i = 0;
            _.each(transmitters.slice(0), function(t) {
                t.group = 1;
                t.selected = false;
                t.id = i; // for the force graph links
                nodeMap[t.mac] = t;
                nodes.push(t);
                allNodes.push(t);
                i++;
            }, this);
        
            // filter nodes if necessary
            if (meshCtrl.selectedNode != null)
            {
                _.each(allNodes, function(t) {
                    var shouldRemoveTransmitter = true;
                    _.each(meshCtrl.selectedNode.neighbors, function(n) {
                        if (t.mac == n || t.mac == meshCtrl.selectedNode.mac)
                        {
                            shouldRemoveTransmitter = false;
                        }
                    }, this);
                    if (shouldRemoveTransmitter)
                    {
                        var index = nodes.indexOf(t);
                        if (index > -1) { nodes.splice(index, 1); }
                    }
                }, this);
            }
    
            // build links
            _.each(nodes, function(t) {
                _.each(t.neighbors, function(n) {
    
                    // if mac has no discovered neighbors yet OR mac has discovered neighbors, but not this one
                    // AND
                    // if neighbor has no neighbors discovered yet OR neighbors has discovered neighbors, but not this one
                    if ( 
                        ((typeof dL[t.mac] == 'undefined') || ((typeof dL[t.mac] != 'undefined') && (dL[t.mac].indexOf(n) == -1)))
                        &&
                        ((typeof dL[n] == 'undefined') || ((typeof dL[n] != 'undefined') && (dL[n].indexOf(t.mac) == -1)))
                        )
                         {
                             // set an array if the neighbor list is undefined
                             dL[t.mac] = dL[t.mac] || [];
                             links.push({"source":nodeMap[t.mac], "target": nodeMap[n]});
    
                             // keep track of the discovered link
                             dL[t.mac].push(n);
                         }
    
                }, meshCtrl);
    
            }, meshCtrl);
            
            // Set the data on the scope
            meshCtrl.chartData = {
                nodes: nodes,
                links: links
            };
            
            meshCtrl.transmitters = allNodes;
        }
        
        populateNodes();

        var selectedNodeChanged = function()
        {
            populateNodes();
        }        
        
        var options = {
            height: 400,
            width: 400
        };

        meshCtrl.selectedNodeChanged = selectedNodeChanged;
        meshCtrl.chartOptions = options;

    });
