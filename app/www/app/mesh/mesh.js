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
            var nodeMap = {};    // a lookup object -- key: mac, value: node object
            var nodes = [];      // the nodes to display
            var allNodes = [];   // all the nodes available
            var links = [];      // the links to display
            var dL = {};         // discoveredLinks
            
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
                // loop throuh all the nodes
                _.each(allNodes, function(t) {
                    // assum we're going to remove the node unless the node is a neighbor of the selected node
                    var shouldRemoveTransmitter = true;
                    
                    // check to see if the current node is a neighbor of the selected node by checking all the neighbors
                    _.each(meshCtrl.selectedNode.neighbors, function(n) {
                        if (t.mac == n || t.mac == meshCtrl.selectedNode.mac)
                        {
                            // if it's a neighbor, we don't want to remove it
                            shouldRemoveTransmitter = false;
                        }
                    }, this);
                    
                    // if it's not a neighbor, we want to remove it
                    if (shouldRemoveTransmitter)
                    {
                        var index = nodes.indexOf(t);
                        if (index > -1) { nodes.splice(index, 1); }
                    }
                }, this);
            }
    
            // build links using the (possibly filtered) array of nodes
            _.each(nodes, function(t) {
                _.each(t.neighbors, function(n) {
    
                    // if mac has no discovered neighbors yet OR mac has discovered neighbors, but not this one
                    // AND
                    // if neighbor has no neighbors discovered yet OR neighbors has discovered neighbors, but not this one
                    // AND
                    // both the source and target exist in the list of nodes
                    if ( 
                        ((typeof dL[t.mac] == 'undefined') || ((typeof dL[t.mac] != 'undefined') && (dL[t.mac].indexOf(n) == -1)))
                        &&
                        ((typeof dL[n] == 'undefined') || ((typeof dL[n] != 'undefined') && (dL[n].indexOf(t.mac) == -1)))
                        &&
                        (nodes.indexOf(nodeMap[t.mac]) > -1 && nodes.indexOf(nodeMap[n]) > -1)
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
