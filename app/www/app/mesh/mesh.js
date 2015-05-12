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
        var nodes = [];
        var nodeIndex = {};
        var links = [];
        var dL = {}; // discoveredLinks
        
        var i = 0;
        _.each(transmitters, function(t) {
            nodeIndex[t.mac] = i;
            i++;
        }, this);

        _.each(transmitters, function(t) {
            nodes.push({
                "macAddress": t.mac,
                "name": t.name,
                "group": 1,
                "selected": false
            });
            
            _.each(t.neighbors, function(n) {

                if ( 
                    
                       ( 
                           // mac has no neighbors yet OR mac has neighbors, but not this one 
                           (typeof dL[t.mac] == 'undefined') || ((typeof dL[t.mac] != 'undefined') && (dL[t.mac].indexOf(n) == -1)) 
                            
                       ) 
                    &&     // AND
                      (
                            // neighbor has no neighbors yet OR neighbors has neighbors, but not this one
                           (typeof dL[n] == 'undefined') || ((typeof dL[n] != 'undefined') && (dL[n].indexOf(t.mac) == -1))
                            
                       )
                    
                    )
                     {
                         // set an array if the neighbor list is undefined
                         dL[t.mac] = dL[t.mac] || [];
                        
                         links.push({"source":nodeIndex[t.mac], "target": nodeIndex[n], value:1});
                         
                         // keep track of the discovered link
                         dL[t.mac].push(n);
                     }
                
            }, meshCtrl);
            
        }, meshCtrl);

        var data = {
            nodes: nodes,
            links: links
        };

        var options = {
            height: 400,
            width: 400
        };

        var selectedNodeChanged = function()
        {
            _.each(nodes, function(node) {
                // set all nodes to unselected, except the node whose id matched the selected node's id.
                node.selected = meshCtrl.selectedNode && meshCtrl.selectedNode.macAddress == node.macAddress;
            }, meshCtrl);
            meshCtrl.chartData.nodes = nodes;
        };
        
        meshCtrl.selectedNodeChanged = selectedNodeChanged;
        meshCtrl.chartData = data;
        meshCtrl.chartOptions = options;

    });