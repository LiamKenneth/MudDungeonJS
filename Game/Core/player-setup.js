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
        var name = modules.helper.cleanInput(input);


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

      var showRaces = modules.data.loadMotd('races').toString('utf-8');

      if (showRaces) {
        socket.write(showRaces);
      }

      socket.once('data', function (input) {
          var input = input.toString().trim().toLowerCase();
          var selectedRace = playerSetup.races(input);

        if (selectedRace != false) {

        var selectRace = function(selected) {
          playerInfo.race = selected;
          //Remove listners to stop duplicate lines being sent
          socket.removeAllListeners('data');
          characterCreation("class");
        }

        var pickRace = function() {
          //Remove listners to stop duplicate lines being sent
          socket.removeAllListeners('data');
           characterCreation("race");
        }

       modules.helper.promptPlayer(socket, selectedRace, selectRace, pickRace);

       }
       else {
         socket.write("Enter the name or number of the race you want. \r\n");
          characterCreation("race");
       }

      });

        break;
        case "class":
        socket.write("What class would you like to be?\r\n");

        var showClasses = modules.data.loadMotd('classes').toString('utf-8');

        if (showClasses) {
          socket.write(showClasses);
        }

        socket.once('data', function (input) {
            var input = input.toString().trim().toLowerCase();
            var selectedClass = playerSetup.classes(input);

          if (selectedClass != false) {

          var selectClass = function(selected) {
            playerInfo.class = selected;
            //Remove listners to stop duplicate lines being sent
            socket.removeAllListeners('data');
            characterCreation("sex");
          }

          var pickClass = function() {
            //Remove listners to stop duplicate lines being sent
            socket.removeAllListeners('data');
             characterCreation("class");
          }

         modules.helper.promptPlayer(socket, selectedClass, selectClass, pickClass);

         }
         else {
           socket.write("Enter the name or number of the race you want. \r\n");
           characterCreation("class");
         }
        });
          break;
          case "sex":
          socket.write("Are you a male or female?\r\n");


          socket.once('data', function (input) {
              var input = input.toString().trim().toLowerCase();
              var selectedSex = playerSetup.sex(input);

            if (selectedSex != false) {

            var selectSex = function(selected) {
              playerInfo.sex = selected;
              //Remove listners to stop duplicate lines being sent
              socket.removeAllListeners('data');
              characterCreation("height");
            }

            var pickSex = function() {
              //Remove listners to stop duplicate lines being sent
              socket.removeAllListeners('data');
               characterCreation("sex");
            }

           modules.helper.promptPlayer(socket, selectedSex, selectSex, pickSex);

           }
           else {
             socket.write("Enter the name or number of the race you want. \r\n");
             characterCreation("sex");
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
      case 'human':
          return 'Human';
      case '2':
      case 'high elf':
          return 'Elf';
      case '3':
      case 'Wood Elf':
          return 'Wood Elf';
      case '4':
      case 'Dark Elf':
          return 'Dark Elf';
      case '5':
      case 'Half Elf':
          return 'Half Elf';
      case '6':
      case 'Hill Dwarf':
          return 'Deep Dwarf';
      case '7':
      case 'Dark Dwarf':
          return 'Dark Dwarf';
      case '8':
      case 'Mountain Dwarf':
          return 'Mountain Dwarf';
      case '9':
      case 'Deep Gnome':
          return 'Deep Gnome';
      case '10':
      case 'Tinker Gnome':
          return 'Tinker Gnome';
      case '11':
      case 'Lightfoot Halfling':
          return 'Lightfoot Halfling';
      case '12':
      case 'Deep Halfling':
          return 'Deep Halfling';
      case '13':
      case 'Minotuar':
          return 'Minotuar';
      case '14':
      case 'Orc':
          return 'Orc';
      case '15':
      case 'Lemurian':
          return 'Lemurian';
      case '16':
      case 'Felar':
          return 'Felar';
      case '17':
      case 'Yinn':
          return 'Yinn';
      default:
      return false;
}
},
classes: function(playerClass) {
  switch (playerClass) {
    case '1':
    case 'warrior':
        return 'Warrior';
    case '2':
    case 'cleric':
        return 'Cleric';
    case '3':
    case 'bard':
        return 'Bard';
    case '4':
    case 'thief':
        return 'Thief';
    case '5':
    case 'mage':
        return 'Mage';
    default:
    return false;
}
},
sex: function(sex) {
  switch (sex) {
    case 'm':
    case 'male':
        return 'Male';
    case 'F':
    case 'female':
        return 'Female';
    return false;
}
 }

};
exports.playerSetup = playerSetup;
})(require);
