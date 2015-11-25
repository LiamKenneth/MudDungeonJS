//(function(r) {

  "use strict";

  var modules = {
    data: require('./data')
  };

var playerSetup = {
  welcome: function(socket) {
console.log("welcome")
    var motd = modules.data.loadMotd('motd');
console.log(motd)
    if (motd) {
      socket.write(motd);
    }

    playerSetup.login(socket);

  },
  login: function(socket) {
      socket.write("What's your name");
  }
};
exports.playerSetup = playerSetup;
//})(require);
