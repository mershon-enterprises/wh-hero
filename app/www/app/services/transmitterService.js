hero.service('TransmitterService', function() {
        var inProduction = (window.hart && window.parser);

        /** @function
         * @name getAll
         * Retrieves an array of Transmitters
         */
        var getAll = function() {
            var transmitters;

            if (inProduction)
            {
                // retrieve collection of transmitters from the parser.
                transmitters =  _.map(
                    window.parser.getTransmitterList(),
                    function(t) {
                        var stats = window.parser.neighborStatistics[t['macAddress']];
                        var neighbors;
                        if (stats === undefined) {
                            neighbors = [];
                        } else {
                            neighbors = _.map(
                                stats.neighbors,
                                function(n) {
                                    return n['macAddress'];
                                }
                            );
                        }

                        return {
                            connected: t['status'] === 208,
                            name: t['name'],
                            mac: t['macAddress'],
                            neighbors: neighbors
                        };
                    }
                );


            }
            else
            {
                // not in production -- return dummy data
                transmitters = [
                    { connected: true, name: "Transmitter 1", mac: "01-02-03-04-05-06-07-08", neighbors: ["02-03-04-05-06-07-08-09","03-04-05-06-07-08-09-10","04-05-06-07-08-09-10-11"] },
                    { connected: true, name: "Transmitter 2", mac: "02-03-04-05-06-07-08-09", neighbors: ["Gateway","01-02-03-04-05-06-07-08","05-06-07-08-09-10-11-12"] },
                    { connected: true, name: "Transmitter 3", mac: "03-04-05-06-07-08-09-10", neighbors: ["Gateway","01-02-03-04-05-06-07-08"] },
                    { connected: true, name: "Transmitter 4", mac: "04-05-06-07-08-09-10-11", neighbors: ["Gateway","01-02-03-04-05-06-07-08","05-06-07-08-09-10-11-12","06-07-08-09-10-11-12-13"] },
                    { connected: true, name: "Transmitter 5", mac: "05-06-07-08-09-10-11-12", neighbors: ["04-05-06-07-08-09-10-11","02-03-04-05-06-07-08-09","06-07-08-09-10-11-12-13","07-08-09-10-11-12-13-14"] },
                    { connected: true, name: "Transmitter 6", mac: "06-07-08-09-10-11-12-13", neighbors: ["04-05-06-07-08-09-10-11","05-06-07-08-09-10-11-12","07-08-09-10-11-12-13-14"] },
                    { connected: true, name: "Transmitter 7", mac: "07-08-09-10-11-12-13-14", neighbors: ["05-06-07-08-09-10-11-12","06-07-08-09-10-11-12-13","08-09-10-11-12-13-14-15"] },
                    { connected: true, name: "Transmitter 8", mac: "08-09-10-11-12-13-14-15", neighbors: ["Gateway","07-08-09-10-11-12-13-14"] }

                ];
            }

            return transmitters;
        };


        var fetchByMacAddress = function(macAddress) {
            return _.reduce(
                this.getAll(),
                function(ignore, t) {
                  if (t['macAddress'] == macAddress) {
                    return {
                        connected: t['status'] === 208,
                        name: t['name'],
                        mac: t['macAddress']
                    };
                  }
                }
            );
        }

        this.getAll = getAll;
        this.fetchByMacAddress = fetchByMacAddress;
    });
