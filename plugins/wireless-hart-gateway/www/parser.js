/*global cordova, module*/

module.exports = {
  DEFAULT_HOST: "192.168.1.10",
  DEFAULT_PORT: 5094,
  MIN_DELAY: 0, // ms

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
        window.hart.login().then(
          // then get the gateway meta-data
          function(loginResponse) {
            window.hart.getGateway().then(
              // then get the gateway device count
              function(gateway) {
                self.gateway = gateway;
                return window.hart.getGatewayDeviceCount(self.gateway);
              },
              function(message) {
                window.hart.disconnect().then(
                  function() {
                    deferred.reject('Failed to get Gateway meta-data at ' + host);
                  }
                );
              }
            ).then(
              // then get gateway device count
              function(deviceCount) {
                self.deviceCount = deviceCount;
                deferred.resolve();
              },
              function(message) {
                window.hart.disconnect().then(
                  function() {
                    deferred.reject('Failed to get Gateway device count at ' + host);
                  }
                );
              }
            );
          },
          function(message) {
            window.hart.disconnect().then(
              function() {
                deferred.reject('Failed to login to Gateway at ' + host);
              }
            );
          }
        );
      },
      function(message) {
        window.hart.disconnect().then(
          function() {
            deferred.reject('Failed to connect to the Gateway at ' + host);
          }
        );
      }
    );

    return deferred.promise;
  },

  maybeGetTransmitter: function(deviceIndex) {
    var self = this;
    var deferred = window.$q.defer();

    if (self.transmitters[deviceIndex] === undefined) {
      //console.log('getting transmitter ' + deviceIndex);
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

    //console.log('polling for device ' + deviceIndex);

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
        var transmitter = self.transmitters[deviceIndex];
        var macAddress = transmitter['macAddress'];
        if (self.hartVariables[macAddress] === undefined) {
          self.hartVariables[macAddress] = [];
        }
        // push the new value onto the front of the array
        self.hartVariables[macAddress].unshift(hartVariables);

        // now, poll the next transmitter
        if (self.pollingEnabled === true) {
          window.setTimeout(
            function() {
              if (deviceIndex === self.deviceCount) {
                self.pollStatistics(1); // start over at 1
              } else {
                self.poll(deviceIndex + 1);
              }
            }, self.MIN_DELAY + 50 // ms
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

    if (self.transmitters[deviceIndex] === undefined) {
      // don't poll statistics unless we already have the transmitter info
      window.setTimeout(
        function() {
          self.pollStatistics(deviceIndex);
        }, self.MIN_DELAY + 500 // ms
      );
      return;
    }

    var deferred = $q.defer();
    window.hart.getNeighborStatistics(self.gateway, self.transmitters[deviceIndex]).then(
      function(hartMessage) {
        // if we get status 33 or 34, keep trying once per second until we
        // get neighbor stats
        //
        if (hartMessage.status === 33 || hartMessage.status === 34) {
          if (self.pollingEnabled === true) {
            console.log('retry statistics for transmitter ' + deviceIndex);
            window.setTimeout(
              function() {
                deferred.resolve();
                self.pollStatistics(deviceIndex);
              }, self.MIN_DELAY + 1000 // ms
            );
          }
        } else {
          self.neighborStatistics[self.transmitters[deviceIndex]['macAddress']] = hartMessage;
          deferred.resolve();

          // now, poll the next transmitter
          if (self.pollingEnabled === true) {
            window.setTimeout(
              function() {
                if (deviceIndex === self.deviceCount) {
                  self.poll(1); // start over at 1
                } else {
                  self.pollStatistics(deviceIndex + 1);
                }
              }, self.MIN_DELAY + 50 // ms
            );
          }

        }
      },
      function() {
        deferred.reject();
        console.log('Failed to get neighbor statistics for transmitter ' +
                    deviceIndex);
      }
    );
  },

  enablePolling: function(host, port) {
    var self = this;
    if (self.pollingEnabled === true) {
      return;
    }

    var h = host, p = port;
    if (h === undefined && p === undefined) {
      h = self.DEFAULT_HOST;
      p = self.DEFAULT_PORT;
    }

    var deferred = $q.defer();
    self.init(h, p).then(
      function() {
        self.pollingEnabled = true;
        console.log('Polling enabled');
        self.poll(1);

        deferred.resolve();
      },
      function(errorMessage) {
        deferred.reject(errorMessage);
      }
    );
    return deferred.promise;
  },

  disablePolling: function() {
    this.pollingEnabled = false;
    this.gateway = null;
    this.deviceCount = 0;

    console.log('Polling disabled');
    return window.hart.disconnect();
  },

  resetData: function() {
    this.hartVariables = {};
    this.neighborStatistics = {};
  },

  getTransmitterList: function() {
    return this.transmitters.slice(1); // drop the 0th item since it is always
                                       // undefined
  },

  load: function() {
    var self = this;

    // load/save data to localstorage
    self.hartVariables = JSON.parse(localStorage.getItem('hartVariables'));
    if (self.hartVariables === null)
      self.hartVariables = {};
    self.neighborStatistics = JSON.parse(localStorage.getItem('neighborStatistics'));
    if (self.neighborStatistics === null)
      self.neighborStatistics = {};
    function onPause() {
      localStorage.setItem('hartVariables', JSON.stringify(self.hartVariables));
      localStorage.setItem('neighborStatistics', JSON.stringify(self.neighborStatistics));
    }
    document.addEventListener("pause", onPause, false);

    return self;
  }
}.load();
