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

        var transmitters = TransmitterService.getAll();
        // add the gateway as a node for things to connect to
        var gatewayNode = {
            connected: true,
            name:      'Gateway',
            mac:       'Gateway',
            neighbors: []
        };
        gatewayNode.neighbors = _.filter(
            _.map(
               transmitters,
               function(t) {
                   var gatewayNeighbor = _.find(
                       t.neighbors,
                       function(tn) {
                           return tn.mac === 'Gateway';
                       }
                   );
                   if (gatewayNeighbor) {
                       return {
                           mac: t.mac,
                           signalStrength: {
                               // switch the to/from
                               from: gatewayNeighbor.signalStrength['to'],
                               to: gatewayNeighbor.signalStrength['from']
                           }
                       };
                   }
               }
            ),
            function(xn) { return xn !== undefined; }
        );
        transmitters.unshift(gatewayNode);

        function populateNodes()
        {
            var nodeMap = {};        // a lookup object -- key: mac, value: node object
            var nodes = [];          // the nodes to display
            var allNodes = [];       // all the nodes available
            var links = [];          // the links to display
            var dL = {};             // discoveredLinks
            
            // create node objects from transmitters by adding the "group" and "selected" properties
            // create a map from mac to node
            var i = 0;
            _.each(transmitters.slice(0), function(t) {
                t.group = 1;
                t.selected = (meshCtrl.selectedNode !== undefined &&
                              t.mac == meshCtrl.selectedNode.mac);
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
                    // assume we're going to remove the node unless the node is a neighbor of the selected node
                    var shouldRemoveTransmitter = true;

                    // check to see if the current node is a neighbor of the selected node by checking all the neighbors
                    _.each(meshCtrl.selectedNode.neighbors, function(n) {
                        if (t.mac == n.mac || t.mac == meshCtrl.selectedNode.mac)
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
                }, meshCtrl);
                
                // build out neighbor detail
                _.each(meshCtrl.selectedNode.neighbors, function(n) {
                    // give it a name, since it isn't supplied (unless kevin wants to supply it)
                    n.name = nodeMap[n.mac].name;
                }, meshCtrl);
                
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
                        ((typeof dL[t.mac] == 'undefined') || ((typeof dL[t.mac] != 'undefined') && (dL[t.mac].indexOf(n.mac) == -1)))
                        &&
                        ((typeof dL[n.mac] == 'undefined') || ((typeof dL[n.mac] != 'undefined') && (dL[n.mac].indexOf(t.mac) == -1)))
                        &&
                        (nodes.indexOf(nodeMap[t.mac]) > -1 && nodes.indexOf(nodeMap[n.mac]) > -1)
                        )
                         {
                             // set an array if the neighbor list is undefined
                             dL[t.mac] = dL[t.mac] || [];
                             links.push({"source":nodeMap[t.mac], "target": nodeMap[n.mac]});
    
                             // keep track of the discovered link
                             dL[t.mac].push(n.mac);
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

        var selectNode = function(mac)
        {
            if (mac !== 'Gateway') {
                meshCtrl.selectedNode = TransmitterService.fetchByMacAddress(mac);
            } else {
                meshCtrl.selectedNode = transmitters[0];
            }
            meshCtrl.selectedNodeChanged();
        }

        var options = {
            height: 400,
            width: 400
        };

        meshCtrl.selectedNodeChanged = selectedNodeChanged;
        meshCtrl.selectNode = selectNode;
        meshCtrl.chartOptions = options;

    });
