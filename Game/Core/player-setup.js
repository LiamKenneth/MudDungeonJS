(function(r) {
  "use strict";

  var modules = {
    data: r('./data').data,
    helper: r('./helpers').helpers,
    commands: r('./commands').commands,
    fs: r('fs'),
    color: r('colors')
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

        if (name.length > 3) {




            socket.write(name.toString().trim() + " You are new to this realm, would you like to create a Character? [" + "Yes".yellow + "/".white + "No".yellow + "]".white );

              socket.once('data', function (input) {
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
        else
        {
          socket.write('Sorry your name must be at least 3 characters long\r\n');
           playerSetup.login(socket);
        }

      });


  },
  createCharacter: function(name, socket) {

/* store player info */
  var playerInfo = {
    name: name.toString().trim(),
    sex: "",
    race: "",
    class: "",
    height: "",
    weight: "",
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
    luc: 0
  }

characterCreation("race");

function characterCreation(stage) {
    switch (stage) {
      case "race":
      socket.write("What race would you like to be?\r\n");

      var motd = modules.data.loadMotd('races').toString('utf-8');

      if (motd) {
        socket.write(motd);
      }
/* really buggy both elses fire multiple times if you enter a wrong option
show race choice
if you enter random shit instead of a number or name it messes up.
should select race
confirm with yes go to class
say no call create race function


 */
      socket.on('data', function (input) {
          var input = input.toString().trim().toLowerCase();
          var selectedRace = playerSetup.races(input);

        if (selectedRace != false) {
          socket.write("You selected " + selectedRace + " are you sure? [Y/N]\r\n");

          socket.on('data', function (input) {
            if (modules.commands.yes(input)) {
              playerInfo.race = selectedRace;
              characterCreation("class");
            }
            else if (modules.commands.no(input)) {
              characterCreation("race");
            }
            else {
              socket.write("Plese answer with yes or no \r\n");
            }
          });

        }
        else {
          socket.write("Enter the name or number of the race you want. \r\n");
        }

      });
        break;
        case "class":
        socket.write("What class would you like to be?\r\n");

        var motd = modules.data.loadMotd('classes').toString('utf-8');

        if (motd) {
          socket.write(motd);
        }

        socket.on('data', function (input) {
            var input = input.toString().trim().toLowerCase();
            var selectedClass = playerSetup.classes(input);

          if (selectedClass != false) {
            playerInfo.class = selectedClass;
          }
          else {
            socket.write("Enter the name or number of the class you want. \r\n");
          }

        });
          break;
      default:

    }
}






  // turning this off for now  modules.data.savePlayer(player);

  },
  createCharacterSheet: function(characterData) {
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
      location: "0,0,0"

    };
  },
  races: function(race) {
    switch (race) {
      case '1':
      case 'Human':
          return 'Human';
      case 2:
      case 'High Elf':
          return 'Elf';
      case 3:
      case 'Wood Elf':
          return 'Wood Elf';
      case 4:
      case 'Dark Elf':
          return 'Dark Elf';
      case 5:
      case 'Half Elf':
          return 'Half Elf';
      case 6:
      case 'Hill Dwarf':
          return 'Deep Dwarf';
      case 7:
      case 'Dark Dwarf':
          return 'Dark Dwarf';
      case 8:
      case 'Mountain Dwarf':
          return 'Mountain Dwarf';
      case 9:
      case 'Deep Gnome':
          return 'Deep Gnome';
      case 10:
      case 'Tinker Gnome':
          return 'Tinker Gnome';
      case 11:
      case 'Lightfoot Halfling':
          return 'Lightfoot Halfling';
      case 12:
      case 'Deep Halfling':
          return 'Deep Halfling';
      case 13:
      case 'Minotuar':
          return 'Minotuar';
      case 14:
      case 'Orc':
          return 'Orc';
      case 15:
      case 'Lemurian':
          return 'Lemurian';
      case 16:
      case 'Felar':
          return 'Felar';
      case 17:
      case 'Yinn':
          return 'Yinn';
      default:
      return false;
}
},
classes: function(playerClass) {
  switch (playerClass) {
    case 1:
    case 'Warrior':
        return 'Warrior';
    case 2:
    case 'Cleric':
        return 'Cleric';
    case 3:
    case 'Bard':
        return 'Bard';
    case 4:
    case 'Thief':
        return 'Thief';
    case 5:
    case 'Mage':
        return 'Mage';
    default:
    return false;
}
  },

};
exports.playerSetup = playerSetup;
})(require);
