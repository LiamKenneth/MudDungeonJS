(function(r) {

"use strict";

var modules = {
  telnet: r('wez-telnet'),
  data: r('./Game/Core/data'),
  playerSetup: r('./Game/Core/player-setup')
};

/*
  Create the telnet server
 */

var telnet = modules.telnet;
var server;
  server = new telnet.Server(function (socket) {

    /* node object # object has no method */
    console.log(modules.playerSetup);
    playerSetup.welcome(socket);
    /* -dodgy export file? */

    console.log("ready");

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
