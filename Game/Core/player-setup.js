(function(r) {
  "use strict";

  var modules = {
    data: r('./data').data
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

      //TODO:Check data if name does't exit create a new character
      socket.once('data', function (input) {
        console.log("data:", input.toString('ascii'));

        if (input.length > 0) {
            socket.write("\n\r" + input + " You are new to this realm, would you like to create a Character? Y / N");

              socket.on('data', function (input) {
                  var input = input.toString('ascii').trim().toLowerCase();

                  console.log("data:", input);
                  if (input === 'y') {
                      playerSetup.createCharacter(input, socket)
                  }
                  else if (input  === 'n') {
                   socket.write("Good bye");
                      socket.end();
                  }
              });

        }

      });


  },
  createCharacter: function(name, socket) {

    socket.write("\n\r" + name + "Entering Character setup..")
  }
};
exports.playerSetup = playerSetup;
})(require);
