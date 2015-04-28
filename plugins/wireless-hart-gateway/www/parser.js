/*global cordova, module*/

module.exports = {
  gateway: null,
  deviceCount: 0,
  transmitters: [],
  hartVariables: {},
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

  poll: function(deviceIndex) {
    var self = this;
    if (self.pollingEnabled === false) {
      console.log('not polling');
      return;
    }

    console.log('polling for device ' + deviceIndex);

    // if we don't have meta-data on the transmitter, get that first
    var transmitter = self.transmitters[deviceIndex];

    var maybeGetTransmitter = function() {
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
    };

    // but normally we can just get the hart variables
    maybeGetTransmitter().then(
      function(transmitter) {
        return window.hart.getTransmitterHartVariables(transmitter);
      },
      function() {
        // shouldn't happen???
      }
    ).then(
      function(hartVariables) {
        console.log('getting hart variables for transmitter transmitter ' +
                    deviceIndex);
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

  enablePolling: function() {
    this.pollingEnabled = true;
    this.poll(1);
  },

  disablePolling: function() {
    this.pollingEnabled = false;
  },
};
