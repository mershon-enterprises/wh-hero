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
                                    return {
                                        mac: n['macAddress'],
                                        signalStrength: {
                                            from: n['rssiFrom'],
                                            to: n['rssiTo']
                                        }
                                    };
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
                    { connected: true, name: "Transmitter 1", mac: "01-02-03-04-05-06-07-08", neighbors: [
                            {
                                mac: "02-03-04-05-06-07-08-09",
                                signalStrength: {
                                    from: -36,
                                    to: -48
                                }
                            },
                            {
                                mac: "03-04-05-06-07-08-09-10",
                                signalStrength: {
                                    from: -42,
                                    to: -50
                                }
                            },
                            {
                                mac: "04-05-06-07-08-09-10-11",
                                signalStrength: {
                                    from: -63,
                                    to: -59
                                }
                            }
                        ] },
                    { connected: true, name: "Transmitter 2", mac: "02-03-04-05-06-07-08-09", neighbors: [
                            {
                                mac: "01-02-03-04-05-06-07-08",
                                signalStrength: {
                                    from: -32,
                                    to: -49
                                }
                            },
                            {
                                mac: "05-06-07-08-09-10-11-12",
                                signalStrength: {
                                    from: -42,
                                    to: -50
                                }
                            }
                        ] },
                    { connected: true, name: "Transmitter 3", mac: "03-04-05-06-07-08-09-10", neighbors: [
                            {
                                mac: "01-02-03-04-05-06-07-08",
                                signalStrength: {
                                    from: -46,
                                    to: -49
                                }
                            }
                        ] },
                    { connected: true, name: "Transmitter 4", mac: "04-05-06-07-08-09-10-11", neighbors: [
                        {
                                mac: "01-02-03-04-05-06-07-08",
                                signalStrength: {
                                    from: -36,
                                    to: -48
                                }
                            },
                            {
                                mac: "05-06-07-08-09-10-11-12",
                                signalStrength: {
                                    from: -42,
                                    to: -50
                                }
                            },
                            {
                                mac: "06-07-08-09-10-11-12-13",
                                signalStrength: {
                                    from: -63,
                                    to: -59
                                }
                            }
                    ] },
                    { connected: true, name: "Transmitter 5", mac: "05-06-07-08-09-10-11-12", neighbors: [
                        {
                                mac: "04-05-06-07-08-09-10-11",
                                signalStrength: {
                                    from: -21,
                                    to: -31
                                }
                            },
                            {
                                mac: "02-03-04-05-06-07-08-09",
                                signalStrength: {
                                    from: -32,
                                    to: -38
                                }
                            },
                            {
                                mac: "06-07-08-09-10-11-12-13",
                                signalStrength: {
                                    from: -58,
                                    to: -54
                                }
                            },
                            {
                                mac: "07-08-09-10-11-12-13-14",
                                signalStrength: {
                                    from: -67,
                                    to: -63
                                }
                            }
                    ] },
                    { connected: true, name: "Transmitter 6", mac: "06-07-08-09-10-11-12-13", neighbors: [
                        {
                                mac: "04-05-06-07-08-09-10-11",
                                signalStrength: {
                                    from: -28,
                                    to: -31
                                }
                            },
                            {
                                mac: "05-06-07-08-09-10-11-12",
                                signalStrength: {
                                    from: -32,
                                    to: -34
                                }
                            },
                            {
                                mac: "07-08-09-10-11-12-13-14",
                                signalStrength: {
                                    from: -38,
                                    to: -34
                                }
                            }
                    ] },
                    { connected: true, name: "Transmitter 7", mac: "07-08-09-10-11-12-13-14", neighbors: [
                        {
                                mac: "05-06-07-08-09-10-11-12",
                                signalStrength: {
                                    from: -31,
                                    to: -39
                                }
                            },
                            {
                                mac: "06-07-08-09-10-11-12-13",
                                signalStrength: {
                                    from: -42,
                                    to: -54
                                }
                            },
                            {
                                mac: "08-09-10-11-12-13-14-15",
                                signalStrength: {
                                    from: -39,
                                    to: -25
                                }
                            }
                    ] },
                    { connected: true, name: "Transmitter 8", mac: "08-09-10-11-12-13-14-15", neighbors: [
                        {
                                mac: "07-08-09-10-11-12-13-14",
                                signalStrength: {
                                    from: -32,
                                    to: -42
                                }
                            }
                    ] }

                ];
            }

            return transmitters;
        };


        var fetchByMacAddress = function(macAddress) {
            return _.find(
                this.getAll(),
                function(t) {
                  if (t['mac'] === macAddress) {
                    return {
                        connected: t['connected'],
                        name: t['name'],
                        mac: t['mac']
                    };
                  }
                }
            );
        }

        this.getAll = getAll;
        this.fetchByMacAddress = fetchByMacAddress;
    });
