/*global cordova, module*/

module.exports = {
    init: function() {
        window.cordovaHTTP.acceptAllCerts(true);

        window.cordovaHTTP.get(
            'https://192.168.1.230:1443/login',
            // 'https://10.0.1.3/login',
            { /*params*/ },
            { /*headers*/ },
            function(response) {
                console.log(response.status);
                alert(response.data);

            }, function(response) {
                alert('Error: ' +response.error);
            }
        );
    }
};
