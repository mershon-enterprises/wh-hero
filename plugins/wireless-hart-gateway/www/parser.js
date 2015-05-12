/*global cordova, module*/

module.exports = {
  gateway: null,
  deviceCount: 0,
  transmitters: [],
  hartVariables: {},
  neighborStatistics: {},
  pollingEnabled: false,

  init: function(host, port) {
    var self = this;

    var deferred = window.$q.defer();

    // connect to the gateway
    window.hart.connect(host, port).then(
      function() {
        return window.hart.login();
      },
      function(message) {
        console.log('Failed to connect to Gateway!');
        deferred.reject();
      }
    ).then(
      // then get the gateway meta-data
      function(loginResponse) {
        return window.hart.getGateway();
      },
      function(message) {
        console.log('Failed to login to Gateway!');
        deferred.reject();
      }
    ).then(
      // then get the gateway device count
      function(gateway) {
        self.gateway = gateway;
        return window.hart.getGatewayDeviceCount(self.gateway);
      },
      function(message) {
        console.log('Failed to get Gateway meta-data!');
        deferred.reject();
      }
    ).then(
      // then get gateway device count
      function(deviceCount) {
        self.deviceCount = deviceCount;
        deferred.resolve();
      },
      function(message) {
        console.log('Failed to get Gateway device count!');
        deferred.reject();
      }
    );

    return deferred.promise;
  },

  maybeGetTransmitter: function(deviceIndex) {
    var self = this;
    var deferred = window.$q.defer();

    if (self.transmitters[deviceIndex] === undefined) {
      console.log('getting transmitter ' + deviceIndex);
      window.hart.getTransmitter(self.gateway, deviceIndex).then(
        function(transmitter) {
          self.transmitters[deviceIndex] = transmitter;

          deferred.resolve(transmitter);
        },
        function(message) {
          console.log('Failed to get transmitter ' + deviceIndex);
          deferred.reject();
        }
      );
    } else {
      deferred.resolve(self.transmitters[deviceIndex]);
    }

    return deferred.promise;
  },

  poll: function(deviceIndex) {
    var self = this;
    if (self.pollingEnabled === false) {
      console.log('not polling');
      return;
    }

    console.log('polling for device ' + deviceIndex);

    self.maybeGetTransmitter(deviceIndex).then(
      function(transmitter) {
        console.log('getting hart variables for transmitter transmitter ' +
                    deviceIndex);
        return window.hart.getTransmitterHartVariables(transmitter);
      },
      function() {
        // shouldn't happen???
      }
    ).then(
      function(hartVariables) {
        self.hartVariables[self.transmitters[deviceIndex]['macAddress']] = hartVariables;

        // now, poll the next transmitter
        if (self.pollingEnabled === true) {
          window.setTimeout(
            function() {
              if (deviceIndex === self.deviceCount) {
                self.poll(1); // start over at 1
              } else {
                self.poll(deviceIndex + 1);
              }
            }, 50 // ms
          );
        }
      },
      function(message) {
        console.log('Failed to get hart variables for transmitter ' +
                    deviceIndex);
      }
    );
  },

  pollStatistics: function(deviceIndex) {
    var self = this;
    if (self.pollingEnabled === false) {
      console.log('not polling');
      return;
    }

    // after getting the hart variables, get the neighbor info
    console.log('getting neighbor statistics for transmitter transmitter ' +
                deviceIndex);

    self.maybeGetTransmitter(deviceIndex).then(
      function(transmitter) {
        return window.hart.getNeighborStatistics(self.gateway, transmitter);
      },
      function() {
        // shouldn't happen???
      }
    ).then(
      function(hartMessage) {
        // if we get status 33 or 34, keep trying once per second until we
        // get neighbor stats
        //
        if (hartMessage.status === 33 || hartMessage.status === 34) {
          if (self.pollingEnabled === true) {
            console.log('retry statistics for transmitter ' + deviceIndex);
            window.setTimeout(
              function() {
                self.pollStatistics(deviceIndex);
              },
              1000
            );
          }
        } else {
          self.neighborStatistics[self.transmitters[deviceIndex]['macAddress']] = hartMessage;

          // now, poll the next transmitter
          if (self.pollingEnabled === true) {
            window.setTimeout(
              function() {
                if (deviceIndex === self.deviceCount) {
                  self.pollStatistics(1); // start over at 1
                } else {
                  self.pollStatistics(deviceIndex + 1);
                }
              }, 50 // ms
            );
          }

        }
      },
      function() {
        console.log('Failed to get neighbor statistics for transmitter ' +
                    deviceIndex);
      }
    );
  },

  enablePolling: function() {
    if (this.pollingEnabled === true)
      return;

    this.pollingEnabled = true;
    console.log('Polling enabled');
    this.poll(1);
    this.pollStatistics(1);
  },

  disablePolling: function() {
    this.pollingEnabled = false;
    this.gateway = null;
    this.deviceCount = 0;
    this.transmitters = [];
    this.hartVariables = {};

    console.log('Polling disabled');
  },

  getTransmitterList: function() {
    return this.transmitters.slice(1); // drop the 0th item since it is always
                                       // undefined
  },
};
