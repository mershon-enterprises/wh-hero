/*global cordova, module*/

module.exports = {
  /* HART stuff */
  MAX_MESSAGE_LENGTH: 512,
  MESSAGE_VERSION: 1,
  MESSAGE_TYPES: {
    'stx':            0,
    'ack':            1,
    'publish-notify': 2
  },
  MESSAGE_IDS: {
    'session-initiate': 0,
    'session-close':    1,
    'keep-alive':       2,
    'hart-wired-pdu':   3
  },
  toHartMessage: function(messageId, transactionId, hartCommand) {
    var self = this;
    var messageLength = (8 + hartCommand.length);

    return [
      self.MESSAGE_VERSION,
      self.MESSAGE_TYPES['stx'],
      messageId,
      0,                           // message status
      (transactionId >> 8 & 0xFF), // transaction id upper byte
      (transactionId & 0xFF),      // transaction id lower byte
      (messageLength >> 8 & 0xFF), // message length upper byte
      (messageLength & 0xFF)       // message length lower byte
    ].concat(hartCommand);
  },
  fromHartMessage: function(binaryPacket) {
    return {
      messageVersion:  binaryPacket[0],
      messageType:     binaryPacket[1],
      messageId:       binaryPacket[2],
      messageStatus:   binaryPacket[3],
      transactionId:   binaryPacket[4] << 8 | binaryPacket[5],
      messageLength:   binaryPacket[6] << 8 | binaryPacket[7],
      messageContents: new Uint8Array(binaryPacket.buffer.slice(8))
    };
  },
  hartChecksum: function(bytes) {
    return _.reduce(bytes, function(checksum, n) {
      return checksum ^= n;
    }, 0);
  },
  withChecksum: function(bytes) {
    var self = this;
    var sliced = bytes.slice(0, bytes.length - 1);
    return sliced.concat([self.hartChecksum(sliced)]);
  },
  toFloat: function(arrayBuffer) {
    var bigEndian = new Uint8Array(arrayBuffer);
    var littleEndian = new Uint8Array(new ArrayBuffer(4));
    littleEndian[0] = bigEndian[3];
    littleEndian[1] = bigEndian[2];
    littleEndian[2] = bigEndian[1];
    littleEndian[3] = bigEndian[0];
    return new Float32Array(littleEndian.buffer)[0];
  },


  /* Socket stuff */
  connectionId: null,
  listeningQueue: [],


  connect: function(host, port) {
    var self = this;

    // listen for incoming responses
    document.addEventListener(
      window.tlantic.plugins.socket.receiveHookName,
      function (ev) {
        // if we have data and there's a queued callback, fire it
        if (ev.metadata &&
            ev.metadata.data.length > 0 &&
            self.listeningQueue.length > 0) {

          // convert character buffer to bytes
          var charBuffer = atob(ev.metadata.data);
          var length = charBuffer.length;
          var buffer = new Uint8Array(new ArrayBuffer(length));
          for (var i = 0; i < length; i++) {
            buffer[i] = charBuffer.charCodeAt(i);
          }

          // pass the buffer to the callable
          var callable = self.listeningQueue.pop();
          callable(buffer);
        }
      }
    );

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.connect(
      function(conn) {
        self.connectionId = conn;

        setTimeout(function() {
          window.tlantic.plugins.socket.isConnected(
            self.connectionId,
            function() {
              deferred.resolve(self.connectionId);
            },
            function(err) {
              deferred.reject(err);
            });
          },
          500 // wait, then verify connection
        );

      },
      function() {
        var err = 'Failed to connect to the specified Gateway';
        console.log(err);
        deferred.reject(err);
      },
      host,
      port
    );
    return deferred.promise;
  },


  login: function() {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return session timeout value
            var connection = {
              sessionType:    contents[0],
              sessionTimeout: contents[1] << 24 |
                              contents[2] << 16 |
                              contents[3] <<  8 |
                              contents[4]
            };
            console.log(JSON.stringify(connection));
            deferred.resolve(connection);
          }
        );

      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['session-initiate'],
        2,                       // transaction id
        [ 0x01,                  // primary/master session
          0x00, 0x00, 0xEA, 0x60 // 60000 ms timeout
        ]
      )
    );
    return deferred.promise;
  },

  getGateway: function() {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return gateway information
            var gateway = {
              frameSize:        contents[ 0] << 8 |
                                contents[ 1],
              command:          contents[ 2],
              byteCount:        contents[ 3],
              responseCode:     contents[ 4],
              status:           contents[ 5],
              expansionCode:    contents[ 6],
              deviceType:       contents[ 7] << 8 |
                                contents[ 8],
              preambles:        contents[ 9],
              hartVersion:      contents[10],
              deviceRevision:   contents[11],
              softwareRevision: contents[12],
              signaling:        contents[13],
              flags:            contents[14],
              deviceId:         contents[15] << 16 |
                                contents[16] <<  8 |
                                contents[17]
            };
            console.log(JSON.stringify(gateway));
            deferred.resolve(gateway);
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        2,        // transaction id
        self.withChecksum(
          [
            0x02, // small frame
            0x80, // device type is 128
            0,    // command 0 = UID
            0x00, // byte count
            0x00  // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  },

  getGatewayDeviceCount: function(gateway) {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return transmitter count
            var hartMessage = {
              frameSize:        contents[ 0],
              deviceType:       contents[ 1] << 8 |
                                contents[ 2],
              deviceId:         contents[ 3] << 16 |
                                contents[ 4] <<  8 |
                                contents[ 5],
              command:          contents[ 6],
              byteCount:        contents[ 7],
              responseCode:     contents[ 8],
              status:           contents[ 9],
              deviceCount:      contents[13] << 8 |
                                contents[14]
            };
            console.log(JSON.stringify(hartMessage));
            // subtract 1 from device count since the gateway counts itself
            deferred.resolve(hartMessage.deviceCount - 1);
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        3,                                  // transaction id
        self.withChecksum(
          [
            0x82,                           // large frame
            gateway.deviceType >> 8 & 0xFF, // device type
            gateway.deviceType      & 0xFF,
            gateway.deviceId >> 16 & 0xFF,  // device id
            gateway.deviceId >>  8 & 0xFF,
            gateway.deviceId       & 0xFF,
            74,                             // command 74 =
                                            //   CMD_READ_IO_SYSTEM_CAPABILITIES
            0x00,                           // byte count
            0x00                            // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  },

  getTransmitter: function(gateway, deviceIndex) {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return transmitter information
            var hartMessage = {
              frameSize:        contents[ 0],
              deviceType:       contents[ 1] << 8 |
                                contents[ 2],
              deviceId:         contents[ 3] << 16 |
                                contents[ 4] <<  8 |
                                contents[ 5],
              command:          contents[ 6],
              byteCount:        contents[ 7],
              responseCode:     contents[ 8],
              status:           contents[ 9],
              deviceIndex:      contents[10] << 8 |
                                contents[11],
              ioCard:           contents[12],
              channel:          contents[13],
              mfgId:            contents[14] << 8 |
                                contents[15],
              subDeviceType:    contents[16] << 8 |
                                contents[17],
              subDeviceId:      contents[18] << 16 |
                                contents[19] <<  8 |
                                contents[20],
              univCmdRevision:  contents[21],
              deviceTag:        new Uint8Array(contents.buffer.slice(22, 54)),
              checksum:         contents[54]
            };
            console.log(JSON.stringify(hartMessage));
            deferred.resolve({
              status: hartMessage.status,
              deviceType: hartMessage.subDeviceType,
              deviceId:   hartMessage.subDeviceId,
              macAddress: ('00-1B-1E-' +
                           ('00' + contents[16].toString(16)).substr(-2) + '-' +
                           ('00' + contents[17].toString(16)).substr(-2) + '-' +
                           ('00' + contents[18].toString(16)).substr(-2) + '-' +
                           ('00' + contents[19].toString(16)).substr(-2) + '-' +
                           ('00' + contents[20].toString(16)).substr(-2)).
                          toUpperCase(),
              name:       String.fromCharCode.
                                 apply(null, hartMessage.deviceTag).
                                 split("\0").        // split on null-terminator
                                 shift()             // and grab the head
            });
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        4,                                  // transaction id
        self.withChecksum(
          [
            0x82,                           // large frame
            gateway.deviceType >> 8 & 0xFF, // device type
            gateway.deviceType      & 0xFF,
            gateway.deviceId >> 16 & 0xFF,  // device id
            gateway.deviceId >>  8 & 0xFF,
            gateway.deviceId       & 0xFF,
            84,                             // command 84 =
                                            //      CMD_READ_SUB_DEVICE_IDENTITY
            0x02,                           // byte count
            deviceIndex >> 8 & 0xFF,        // device index
            deviceIndex      & 0xFF,
            0x00                            // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  },

  getTransmitterHartVariables: function(transmitter) {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return transmitter information
            var hartMessage = {
              frameSize:        contents[ 0],
              deviceType:       contents[ 1] << 8 |
                                contents[ 2],
              deviceId:         contents[ 3] << 16 |
                                contents[ 4] <<  8 |
                                contents[ 5],
              command:          contents[ 6],
              byteCount:        contents[ 7],
              responseCode:     contents[ 8],
              status:           contents[ 9],
              loopCurrent:      self.toFloat(contents.buffer.slice(10, 14)),
              pvUnits:          contents[14],
              pvValue:          self.toFloat(contents.buffer.slice(15, 19)),
              svUnits:          contents[19],
              svValue:          self.toFloat(contents.buffer.slice(20, 24)),
              tvUnits:          contents[24],
              tvValue:          self.toFloat(contents.buffer.slice(25, 29)),
              qvUnits:          contents[29],
              qvValue:          self.toFloat(contents.buffer.slice(30, 34)),
              checksum:         contents[34]
            };
            console.log(JSON.stringify(hartMessage));
            deferred.resolve({
              pvValue: hartMessage.pvValue,
              pvUnits: hartMessage.pvUnits,
              svValue: hartMessage.svValue,
              svUnits: hartMessage.svUnits,
              tvValue: hartMessage.tvValue,
              tvUnits: hartMessage.tvUnits,
              qvValue: hartMessage.qvValue,
              qvUnits: hartMessage.qvUnits
            });
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        5,                                      // transaction id
        self.withChecksum(
          [
            0x82,                               // large frame
            transmitter.deviceType >> 8 & 0xFF, // device type
            transmitter.deviceType      & 0xFF,
            transmitter.deviceId >> 16 & 0xFF,  // device id
            transmitter.deviceId >>  8 & 0xFF,
            transmitter.deviceId       & 0xFF,
            3,                                  // command 3 =
                                                //    Read All Dynamic Variables
            0x00,                               // byte count
            0x00                                // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  },

  drainDelayedResponse: function(transmitter) {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            // return transmitter information
            var hartMessage = {
              frameSize:        contents[ 0],
              deviceType:       contents[ 1] << 8 |
                                contents[ 2],
              deviceId:         contents[ 3] << 16 |
                                contents[ 4] <<  8 |
                                contents[ 5],
              command:          contents[ 6],
              byteCount:        contents[ 7],
              responseCode:     contents[ 8],
              status:           contents[ 9],
              checksum:         contents[10]
            };
            //console.log(JSON.stringify(hartMessage));
            deferred.resolve({
              complete: (hartMessage.status === 0)
            });
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        6,                                      // transaction id
        self.withChecksum(
          [
            0x82,                               // large frame
            transmitter.deviceType >> 8 & 0xFF, // device type
            transmitter.deviceType      & 0xFF,
            transmitter.deviceId >> 16 & 0xFF,  // device id
            transmitter.deviceId >>  8 & 0xFF,
            transmitter.deviceId       & 0xFF,
            106,                                // command 106 =
                                                //    Drain Delayed Response
            0x00,                               // byte count
            0x00                                // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  },

  getNeighborStatistics: function(gateway, transmitter) {
    var self = this;

    var deferred = window.$q.defer();
    window.tlantic.plugins.socket.sendBinary(
      function(response) {
        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            var contents = message.messageContents;

            var hartMessage = undefined;
            // if we get status 33 that means a new delayed response has been
            // initiated.
            //
            // if we get status 34 that means a delayed response is currently
            // processing.
            if (contents[9] === 33 || contents[9] === 34) {
              // return delayed status
              hartMessage = {
                frameSize:        contents[ 0],
                deviceType:       contents[ 1] << 8 |
                                  contents[ 2],
                deviceId:         contents[ 3] << 16 |
                                  contents[ 4] <<  8 |
                                  contents[ 5],
                command:          contents[ 6],
                byteCount:        contents[ 7],
                responseCode:     contents[ 8],
                status:           contents[ 9]
              };
            } else {
              // return transmitter information
              hartMessage = {
                // frameSize:        contents[ 0],
                // deviceType:       contents[ 1] << 8 |
                //                   contents[ 2],
                // deviceId:         contents[ 3] << 16 |
                //                   contents[ 4] <<  8 |
                //                   contents[ 5],
                // command:          contents[ 6],
                // byteCount:        contents[ 7],
                responseCode:     contents[ 8],
                status:           contents[ 9],
                //uniqueStatsId:     contents[10] << 32 |
                //                   contents[11] << 24 |
                //                   contents[12] << 16 |
                //                   contents[13] <<  8 |
                //                   contents[14],
                radioNodeId:      contents[15] << 24 |
                                  contents[16] << 16 |
                                  contents[17] <<  8 |
                                  contents[18],
                // radioMacId:       contents[19] << 56 |
                //                   contents[20] << 48 |
                //                   contents[21] << 40 |
                //                   contents[22] << 32 |
                //                   contents[23] << 24 |
                //                   contents[24] << 16 |
                //                   contents[25] <<  8 |
                //                   contents[26],
                nodeState:        contents[27],
                reliabilityPct:   self.toFloat(contents.buffer.slice(28, 32)),
                latencyPct:       self.toFloat(contents.buffer.slice(32, 36)),
                networkJoins:     contents[36] <<  8 |
                                  contents[37],
                // joinTime:         contents[38] << 56 |
                //                   contents[39] << 48 |
                //                   contents[40] << 40 |
                //                   contents[41] << 32 |
                //                   contents[42] << 24 |
                //                   contents[43] << 16 |
                //                   contents[44] <<  8 |
                //                   contents[45],
                neighborNeeded:   contents[46],
                activeNeighbors:  contents[47] <<  8 |
                                  contents[48],
                neighbors: [ /* filled in below */ ]
              };

              // add the neighbors
              // :neighbor-id             [:ubyte :ubyte :ubyte :ubyte :ubyte]
              // :neighbor-rssi-to        :byte
              // :neighbor-rssi-from      :byte
              // :neighbor-path-stability :float32
              var base = 49;
              for (var rel=0; rel<hartMessage.activeNeighbors; rel++) {
                  hartMessage.neighbors.push({
                    deviceType: contents[base+0] <<  8 |
                                contents[base+1],
                    deviceId:   contents[base+2] << 16 |
                                contents[base+3] <<  8 |
                                contents[base+4],
                    macAddress: ('00-1B-1E-' +
                       ('00' + contents[base+0].toString(16)).substr(-2) + '-' +
                       ('00' + contents[base+1].toString(16)).substr(-2) + '-' +
                       ('00' + contents[base+2].toString(16)).substr(-2) + '-' +
                       ('00' + contents[base+3].toString(16)).substr(-2) + '-' +
                       ('00' + contents[base+4].toString(16)).substr(-2)).
                      toUpperCase(),
                    rssiTo: -(255 - contents[base+5]),
                    rssiFrom: -(255 - contents[base+6]),
                    pathStability: self.toFloat(contents.buffer.slice(base+7, base+11))
                  });
                  base += 11;
              }
            }

            console.log(JSON.stringify(hartMessage));
            deferred.resolve(hartMessage);
          }
        );
      },
      function(message) {
        deferred.reject(message);
      },
      self.connectionId,
      self.toHartMessage(
        self.MESSAGE_IDS['hart-wired-pdu'],
        7,                                      // transaction id
        self.withChecksum(
          [
            0x82,                               // large frame
            gateway.deviceType >> 8 & 0xFF, // device type
            gateway.deviceType      & 0xFF,
            gateway.deviceId >> 16 & 0xFF,  // device id
            gateway.deviceId >>  8 & 0xFF,
            gateway.deviceId       & 0xFF,
            202,                                // command 202 =
                                                //    Get Neighbor Statistics
            0x05,                               // byte count
            transmitter.deviceType >> 8 & 0xFF, // device type
            transmitter.deviceType      & 0xFF,
            transmitter.deviceId >> 16 & 0xFF,  // device id
            transmitter.deviceId >>  8 & 0xFF,
            transmitter.deviceId       & 0xFF,
            0x00                                // checksum default to 0
          ]
        )
      )
    );
    return deferred.promise;
  }
};
