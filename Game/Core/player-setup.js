//(function(r) {

  "use strict";

  var modules = {
    data: require('./data').data
  };

var playerSetup = {
  welcome: function(socket) {

    var motd = modules.data.loadMotd('motd');

    if (motd) {
      socket.write(motd);
    }

     playerSetup.login(socket);

  },
  login: function(socket) {
      socket.write("What's your name?");
  }
};
exports.playerSetup = playerSetup;
//})(require);
