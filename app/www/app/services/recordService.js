hero.service("RecordService", function() {
    var inProduction = (window.hart && window.parser);

    /** @function
     * @name getAll
     * Retrieves an array of Transmitters
     */
    var fetchMostRecentTransmitterData = function(macAddress) {
        var record;

        if (inProduction)
        {
            var hartVariables = window.parser.hartVariables[macAddress];
            if (hartVariables === undefined || hartVariables.length === 0) {
                record = {
                    pv: undefined,
                    sv: undefined,
                    tv: undefined,
                    qv: undefined
                };
            } else {
                record = {
                    pv: hartVariables[0]['pvValue'].toFixed(2),
                    sv: hartVariables[0]['svValue'].toFixed(2),
                    tv: hartVariables[0]['tvValue'].toFixed(2),
                    qv: hartVariables[0]['qvValue'].toFixed(2)
                };
            }
        }
        else
        {
            // not in production -- return dummy data
            switch(macAddress) {
                case "01-02-03-04-05-06-07-08":
                record = { pv: 1.2, sv: 3.4, tv: 5.6, qv: 7.8 };
                break;

                case "02-03-04-05-06-07-08-09":
                record = { pv: 2.3, sv: 4.5, tv: 6.7, qv: 8.9 };
                break;

                case "03-04-05-06-07-08-09-10":
                record = { pv: 3.4, sv: 5.6, tv: 7.8, qv: 9.10 };
                break;

                case "04-05-06-07-08-09-10-11":
                record = { pv: 4.5, sv: 6.7, tv: 8.9, qv: 10.11 };
                break;

                case "05-06-07-08-09-10-11-12":
                record = { pv: 1.2, sv: 3.4, tv: 5.6, qv: 7.8 };
                break;

                case "06-07-08-09-10-11-12-13":
                record = { pv: 2.3, sv: 4.5, tv: 6.7, qv: 8.9 };
                break;

                case "07-08-09-10-11-12-13-14":
                record = { pv: 3.4, sv: 5.6, tv: 7.8, qv: 9.10 };
                break;

                case "08-09-10-11-12-13-14-15":
                record = { pv: 4.5, sv: 6.7, tv: 8.9, qv: 10.11 };
                break;
            }
        }

        return record;
    };

    var getTransmitterMeasurementHistory = function(macAddress, measurementName)
    {
        var measurementHistory;

        if (inProduction)
        {
            var hartVariables = window.parser.hartVariables[macAddress];
            if (hartVariables === undefined || hartVariables.length === 0) {
                measurementHistory = [];
            } else {
                var valName = measurementName + 'Value';
                measurementHistory = _.map(
                    hartVariables,
                    function(x) {
                        return {
                            date: x['date'],
                            value: x[valName]
                        };
                    }
                );
            }
        }
        else
        {
            switch(measurementName)
            {
                case "pv":
                    measurementHistory = [
                        { date: '2015-04-25T09:15:13.000Z', value: 1.5 },
                        { date: '2015-04-25T09:15:48.000Z', value: 1.6 },
                        { date: '2015-04-25T09:16:14.000Z', value: 1.3 },
                        { date: '2015-04-25T09:16:49.000Z', value: 1.4 },
                        { date: '2015-04-25T09:17:15.000Z', value: 1.5 },
                        { date: '2015-04-25T09:17:49.000Z', value: 1.6 },
                        { date: '2015-04-25T09:18:16.000Z', value: 1.3 },
                        { date: '2015-04-25T09:18:50.000Z', value: 1.4 }
                    ];
                break;

                case "sv":
                    measurementHistory = [
                        { date: '2015-04-25T09:15:13.000Z', value: 2.7 },
                        { date: '2015-04-25T09:15:48.000Z', value: 2.4 },
                        { date: '2015-04-25T09:16:14.000Z', value: 2.3 },
                        { date: '2015-04-25T09:16:49.000Z', value: 2.6 },
                        { date: '2015-04-25T09:17:13.000Z', value: 2.7 },
                        { date: '2015-04-25T09:17:48.000Z', value: 2.4 },
                        { date: '2015-04-25T09:18:14.000Z', value: 2.3 },
                        { date: '2015-04-25T09:18:49.000Z', value: 2.6 }
                    ];
                break;

                case "tv":
                    measurementHistory = [
                        { date: '2015-04-25T09:15:13.000Z', value: 4.6 },
                        { date: '2015-04-25T09:15:48.000Z', value: 4.4 },
                        { date: '2015-04-25T09:16:14.000Z', value: 4.2 },
                        { date: '2015-04-25T09:16:49.000Z', value: 4.8 },
                        { date: '2015-04-25T09:17:13.000Z', value: 4.6 },
                        { date: '2015-04-25T09:17:48.000Z', value: 4.4 },
                        { date: '2015-04-25T09:18:14.000Z', value: 4.2 },
                        { date: '2015-04-25T09:18:49.000Z', value: 4.8 }

                    ];
                break;

                case "qv":
                    measurementHistory = [
                        { date: '2015-04-25T09:15:13.000Z', value: 3.8 },
                        { date: '2015-04-25T09:15:48.000Z', value: 3.9 },
                        { date: '2015-04-25T09:16:14.000Z', value: 3.7 },
                        { date: '2015-04-25T09:16:49.000Z', value: 3.5 },
                        { date: '2015-04-25T09:17:13.000Z', value: 3.8 },
                        { date: '2015-04-25T09:17:48.000Z', value: 3.9 },
                        { date: '2015-04-25T09:18:14.000Z', value: 3.7 },
                        { date: '2015-04-25T09:18:49.000Z', value: 3.5 }

                    ];
                break;
            }

        }

        return measurementHistory;
    }

    this.fetchMostRecentTransmitterData = fetchMostRecentTransmitterData;
    this.getTransmitterMeasurementHistory = getTransmitterMeasurementHistory;
});
