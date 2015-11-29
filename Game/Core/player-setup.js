(function(r) {
  "use strict";

  var modules = {
    data: r('./data').data,
    fs: r('fs')
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
        var name = input;
        console.log("data:", input.toString('ascii'));

        if (name.length > 0) {


            socket.write(name.toString().trim() + " You are new to this realm, would you like to create a Character? Y / N");

              socket.on('data', function (input) {
                  var input = input.toString().trim().toLowerCase();

                  console.log("data:", input);
                  if (input === 'y') {
                      playerSetup.createCharacter(name, socket)
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

    socket.write(name.toString().trim() + " Entering Character setup..");

// for testing
    var player = {
      name: name,
      level: 1,
      race: "Human",
      class: "Mage",
      align: "neutral",
      inv: {
        gold: 0,
        silver: 0,
        copper: 10
      },
      wear: {
        light: "Glowing ball",
        head: "nothing",
        neck: "nothing",
        neck1: "nothing",
        cloak: "nothing",
        cloak1: "nothing",
        AboutBody: "nothing",
        body: "nothing"
      },
      age: 18,
      weight:180,
      height: "5ft, 11",
      descripion: "You see nothing special about them",

    };

    player.name = name.toString().trim();

  modules.fs.writeFile('./Data/' + player.name + '.json', JSON.stringify(player), function (err) {
    if (err) {
      return console.log(err);
    }
  })


  }
};
exports.playerSetup = playerSetup;
})(require);
