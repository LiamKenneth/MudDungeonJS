(function(r) {
  "use strict";

  var modules = {
    data: r('./data').data,
    helper: r('./helpers').helpers,
    commands: r('./commands').commands,
    playerSetup: {
        races: r('./PlayerSetup/races').races,
        classes: r('./PlayerSetup/classes').classes,
        stats: r('./PlayerSetup/stats').stats,
        player: r('./playerSetup/player-manager').playerManager
    },
      loadPlayerLocation: r('./loadRoom').playerLocation,
    fs: r('fs'),
    color: r('colors')
  };

  var playerSetup = {

    welcome: function(socket) {

        modules.helper.send(socket, 'hello');



      var motd = modules.data.loadMotd('motd');

      if (motd) {
          modules.helper.send(socket, motd);
      }

      playerSetup.login(socket);

    },
    login: function(socket) {

        console.log(socket)

        modules.helper.send(socket,"What's your name?");

      //TODO:Check data if name does't exit create a new character
      socket.once('data', function(input) {
        var name = modules.helper.cleanInput(input);
        var response = {
            newChar: name.toString().trim() + " You are new to this realm, would you like to create a Character?" +
            " [" + "Yes".yellow + "/".white + "No".yellow + "]".white,
            newCharError: 'Sorry your name must be at least 3 characters long',
            newCharEnd: 'Good bye'


        }

        if (name.length > 3) {

            modules.helper.send(socket, response.newChar );

          socket.once('data', function(input) {
            var input = input.toString().trim().toLowerCase();

            console.log("data:", input);
            if (input === 'y') {
              playerSetup.createCharacter(name, socket);
            } else if (input === 'n') {
              socket.write(response.newCharEnd);
                socket.emit('data', { data: response.newCharEnd });
              socket.end();
            }
          });

        } else {
          socket.write(response.newCharError);
            socket.emit('data', { data: response.newCharError });
          playerSetup.login(socket);
        }

      });


    },
    createCharacter: function(name, socket) {

      /* store player info */
      var playerInfo = {
        name: name.toString().trim(),
          level: 1,
          race: '',
          class: '',
          align: "neutral",
          stats: {
              str: 0,
              dex: 0,
              con: 0,
              int: 0,
              wis: 0,
              cha: 0
          },
          inv: {
              gold: 0,
              silver: 0,
              copper: 10
          },
          wear: {
              light: "Nothing",
              head: "Nothing",
              neck: "Nothing",
              neck1: "Nothing",
              cloak: "Nothing",
              cloak1: "Nothing",
              AboutBody: "Nothing",
              body: "Nothing"
          },
          age: 18,
          description: "You see nothing special about them",
          location: "0,0,0"
      };

        var response = {
            raceChoice: 'What race would you like to be?\r\n',

        }

      characterCreation("race");

      function characterCreation(stage) {
        switch (stage) {

          case "race":
            socket.write(response.raceChoice);
              socket.emit('data', { data: response.raceChoice });

              socket.write("\r\n" + modules.playerSetup.races.showRace());
              socket.emit('data', { data: "\r\n" + modules.playerSetup.races.showRace() });


            socket.once('data', function(input) {
              var input = input.toString().trim().toLowerCase();
                console.log(input)
              var selectedRace = modules.playerSetup.races.chooseRace(input);
console.log(selectedRace)
              if (selectedRace !== false) {

                var selectRace = function(selected) {
                  playerInfo.race = selected;
                  //Remove listners to stop duplicate lines being sent
                  socket.removeAllListeners('data');
                  characterCreation("class");
                };

                var pickRace = function() {
                  //Remove listners to stop duplicate lines being sent
                  socket.removeAllListeners('data');
                  characterCreation("race");
                };

                modules.helper.promptPlayer(socket, selectedRace, selectRace, pickRace);

              } else {
                socket.write("Sorry that's not a race. \r\n");
                  socket.emit('data', { data: "Sorry that's not a race. \r\n" });
                characterCreation("race");
              }

            });

            break;
          case "class":
              socket.write("What class would you like to be?\r\n");
              socket.emit('data', { data: "What class would you like to be?\r\n" });
              socket.write("\r\n" + modules.playerSetup.classes.showClass());
              socket.emit('data', { data: "\r\n" + modules.playerSetup.classes.showClass() });

              socket.once('data', function(input) {

                  var input = input.toString().trim().toLowerCase();
                  var selectedClass =  modules.playerSetup.classes.chooseClass(input);

                  if (selectedClass !== false) {

                    var selectClass = function(selected) {
                       playerInfo.class = selected;
                       //Remove listeners to stop duplicate lines being sent
                      socket.removeAllListeners('data');
                      characterCreation("sex");
                    };

                    var pickClass = function() {
                        socket.write("Sorry that's not a class.\r\n");

                        //Remove listeners to stop duplicate lines being sent
                        socket.removeAllListeners('data');
                      characterCreation("class");
                    };

                    modules.helper.promptPlayer(socket, selectedClass, selectClass, pickClass);

                  } else {
                      socket.write("Sorry that's not a class. \r\n");
                      socket.emit('data', { data: "Sorry that's not a class" });
                      characterCreation("class");
                  }
            });
            break;
          case "sex":
            socket.write("Are you a male or female?\r\n");
              socket.emit('data', { data: "Are you a male or female" });

            socket.once('data', function(input) {
              var input = input.toString().trim().toLowerCase();
              var selectedSex = playerSetup.sex(input);

              if (selectedSex != false) {

                var selectSex = function(selected) {
                    playerInfo.sex = selected;
                    //Remove listeners to stop duplicate lines being sent
                    socket.removeAllListeners('data');
                    characterCreation("stats");
                };

                var pickSex = function() {
                    //Remove listeners to stop duplicate lines being sent
                    socket.removeAllListeners('data');
                    characterCreation("sex");
                };

                modules.helper.promptPlayer(socket, selectedSex, selectSex, pickSex);

              } else {
                  socket.write("Enter the name or number of the race you want. \r\n");
                  socket.emit('data', { data: "Enter the name or number of the race you want. \r\n" });

                  characterCreation("sex");
              }
            });
            break;

            case "stats":

                    var playerStats  = modules.playerSetup.stats.playerStats();
                    var stats = "str: " + playerStats.str + " dex: " + playerStats.dex + " con: " + playerStats.con +
                        " int: " + playerStats.int + " wis: " + playerStats.wis + " cha: " + playerStats.cha
                        + " | Do you accept these stats? [Yes No]";
                    socket.write(stats);
                socket.emit('data', { data: stats });

                    socket.once('data', function(input) {
                        var input = input.toString().trim().toLowerCase();


                        if(modules.commands.yes(input)) {

                            playerInfo.stats.str = playerStats.str;
                            playerInfo.stats.dex = playerStats.dex;
                            playerInfo.stats.con = playerStats.con;
                            playerInfo.stats.int = playerStats.int;
                            playerInfo.stats.wis = playerStats.wis;
                            playerInfo.stats.cha = playerStats.cha;

                            playerSetup.createCharacterSheet(socket, playerInfo);

                        }else {
                            //Remove listeners to stop duplicate lines being sent
                            socket.removeAllListeners('data');
                            characterCreation("stats");
                        }



                    });

                break;


          default:
            console.log('if you\'re here, something terrible happened making a character');
        }
      }



    },
    createCharacterSheet: function(socket, characterData) {
        console.log(characterData)
      var player = {
        name: characterData.name,
        level: 1,
        race: characterData.race,
        class: characterData.class,
        align: "neutral",
        stats: {
          str: characterData.stats.str,
          dex: characterData.stats.dex,
          con: characterData.stats.con,
          int: characterData.stats.int,
          wis: characterData.stats.wis,
          cha: characterData.stats.cha
        },
        inv: {
          gold: 0,
          silver: 0,
          copper: 10
        },
        wear: {
          light: "Nothing",
          head: "Nothing",
          neck: "Nothing",
          neck1: "Nothing",
          cloak: "Nothing",
          cloak1: "Nothing",
          AboutBody: "Nothing",
          body: "Nothing"
        },
        age: 18,
        description: "You see nothing special about them",
        location: "0,0,0"

      };

      modules.data.savePlayer(player);

      console.log('player saved, the end.');

       modules.playerSetup.player.addPlayer(socket);

        socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.loadRoom(socket, player));

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
