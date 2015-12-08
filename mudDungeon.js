(function(r) {

"use strict";

var modules = {
    telnet: r('wez-telnet'), 
    data: r('./Game/Core/data'),
    playerSetup: r('./Game/Core/player-setup').playerSetup
};

/*
  Create the telnet server
 */

var telnet = modules.telnet;
var server = new telnet.Server(function (socket) {
    
	socket.emit('welcome', modules.playerSetup.welcome(socket));

    socket.on('interrupt', function () {
    socket.write("INTR!");
      // disconnect on CTRL-C!
      socket.end();
    });

});
    server.listen(23);


})(require);
