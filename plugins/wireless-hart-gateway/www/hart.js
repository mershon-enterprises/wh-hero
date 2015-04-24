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
  fromHartMessage: function(data) {
    console.log('fromHartMessage: data: ' + JSON.stringify(data));
    console.log('fromHartMessage: data.length: ' + data.length);
    return {
      messageVersion:  data[0],
      messageType:     data[1],
      messageId:       data[2],
      messageStatus:   data[3],
      transactionId:   (data[4] << 8) + data[5],
      messageLength:   (data[6] << 8) + data[7],
      messageContents: data.slice(8)
    };
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
        console.log('RESPONSE RECEIVED');
        console.log(JSON.stringify(ev.metadata.data));

        // if we have data and there's a queued callback, fire it
        if (ev.metadata &&
            ev.metadata.data.length > 0 &&
            self.listeningQueue.length > 0) {

          var callable = self.listeningQueue.pop();
          callable(ev.metadata.data);
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
      function() {

        self.listeningQueue.push(
          function(response) {
            var message = self.fromHartMessage(response);
            console.log(JSON.stringify(message));
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
        1,
        [ 0x01, /* primary/master session */
          0x00, 0x00, 0xEA, 0x60 /* 60000 ms timeout */
        ]
      )
    );
    return deferred.promise;
  }
};
