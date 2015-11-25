(function(r) {

"use strict";

var modules = {
  telnet: r('wez-telnet'),
  data: r('./Game/Core/data'),
playerSetup: r ('./Game/Core/player-setup').playerSetup
};

/*
  Create the telnet server
 */

var telnet = modules.telnet;
var server;
  server = new telnet.Server(function (socket) {

    /* show motd */
	socket.emit('welcome', modules.playerSetup.welcome(socket));

    socket.on('data', function (input) {
      console.log("data:", input.toString('ascii'));

      socket.write("you said " + input);
    });

    socket.on('interrupt', function () {
    socket.write("INTR!");
      // disconnect on CTRL-C!
      socket.end();
    });
    socket.on('close', function () {
      console.log("END!");
    });
 });
 server.listen(23);


})(require);
