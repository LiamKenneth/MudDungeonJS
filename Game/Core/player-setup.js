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
            player: r('./PlayerSetup/player-manager').playerManager,
            playerChar: r('./PlayerSetup/player').player,
        },
        loadPlayerLocation: r('./loadRoom').playerLocation,
        fs: r('fs'),
        color: r('colors')
    };
  //  var weapons = modules.data.loadFile('./Game/Core/Items/Weapons/swords/', 'swords.json');
    var playerSetup = {
        welcome: function (socket) {

              var motd = modules.data.loadFile(null, 'motd');
               if (motd) {
                  modules.helper.send(socket, motd);
               }
            playerSetup.login(socket);
        },
        login: function(socket) {
            modules.helper.send(socket, "What's your name?");

            socket.once('data', function(input) {
                var name = modules.helper.cleanInput(input);
                var response = {
                    newChar: name.toString().trim() + " You are new to this realm, would you like to create a Character?" +
                        " [" + "Yes" + "/" + "No" + "]",
                    newCharError: 'Sorry your name must be at least 3 characters long',
                    newCharEnd: 'Good bye',
                    charPassword: 'What is your password?',
                    charPasswordError: 'Password is incorrect'
                }
                if (name.length >= 3) {
                    //Check Player exists
                    var playerData = JSON.parse(modules.data.loadFile(null, name + '.json'));
                    if (playerData) {
                        var PC = new modules.playerSetup.playerChar(playerData);
                        PC.setSocket(socket);
                        modules.playerSetup.player.addPlayer(PC.getSocket());
                        modules.playerSetup.player.loadPlayer(PC);
                    } else {
                        modules.helper.send(socket, response.newChar);
                        socket.once('data', function(input) {
                            var input = input.toString().trim().toLowerCase();
                            if (modules.commands.yes(input)) {
                                playerSetup.createCharacter(name, socket);
                            } else if (modules.commands.no(input)) {
                                modules.helper.send(socket, response.newCharEnd);
                                socket.emit('close');
                            } else {
                                playerSetup.login(socket);
                            }
                        });
                    }
                } else {
                    modules.helper.send(socket, response.newCharError);
                    playerSetup.login(socket);
                }
            });
        },
        createCharacter: function(name, socket) {
            // /* store player info */
            var playerInfo = new Object();
            playerInfo.name = name;

            var CharOptions = function(socket, choice) {
                modules.helper.send(socket, choice.text.choice.trim());
                if (choice.hasOwnProperty('options')) {
                    modules.helper.send(socket, choice.options.trim());
                }
                socket.once('data', function(input) {
                    var input = input.toString().trim().toLowerCase();
                    var selected = choice.pick(input) || false;
                    if (selected !== false) {
                        var select = function(selected) {
                            playerInfo[choice.select] = selected;
                            //Remove listners to stop duplicate lines being sent
                            socket.removeAllListeners('data');
                            characterCreation(choice.nextChoice);
                        };
                        var pick = function() {
                            //Remove listners to stop duplicate lines being sent
                            socket.removeAllListeners('data');
                            characterCreation(choice.select);
                        };
                        modules.helper.promptPlayer(socket, selected, select, pick);
                    } else {
                        modules.helper.send(socket, choice.text.wrongChoice);
                        characterCreation(choice.select);
                    }
                });
            }
            characterCreation("race");

            function characterCreation(stage) {
                switch (stage) {
                    case "race":

                        var choice = {
                            select: 'race',
                            nextChoice: 'class',
                            text: {
                                choice: 'What race would you like to be?',
                                wrongChoice: 'Sorry that\'s not a race.'
                            },
                            options: modules.playerSetup.races.showRace(),
                            pick: function(input) {
                                return modules.playerSetup.races.chooseRace(input)
                            }
                        }
                        CharOptions(socket, choice);
                        break;
                    case "class":

                        var choice = {
                            select: 'class',
                            nextChoice: 'sex',
                            text: {
                                choice: 'What class would you like to be?',
                                wrongChoice: 'Sorry that\'s not a class'
                            },
                            options: modules.playerSetup.classes.showClass(),
                            pick: function(input) {
                                return modules.playerSetup.classes.chooseClass(input)
                            }
                        }
                        CharOptions(socket, choice);
                        break;
                    case "sex":

                        var choice = {
                            select: 'sex',
                            nextChoice: 'stats',
                            text: {
                                choice: 'Are you a male or female?',
                                wrongChoice: 'Sorry that\'s not a choice'
                            },
                            pick: function(input) {
                                return playerSetup.sex(input)
                            }
                        }
                        CharOptions(socket, choice);
                        break;
                    case "stats":

                        var playerStats = modules.playerSetup.stats.playerStats();
                        var stats = "str: " + playerStats.str + " dex: " + playerStats.dex + " con: " + playerStats.con +
                            " int: " + playerStats.int + " wis: " + playerStats.wis + " cha: " + playerStats.cha + " | Do you accept these stats? [Yes No]";
                        modules.helper.send(socket, stats);
                        socket.once('data', function(input) {
                            var input = input.toString().trim().toLowerCase();
                            if (modules.commands.yes(input)) {
                                playerInfo.str = playerStats.str;
                                playerInfo.dex = playerStats.dex;
                                playerInfo.con = playerStats.con;
                                playerInfo.int = playerStats.int;
                                playerInfo.wis = playerStats.wis;
                                playerInfo.cha = playerStats.cha;
                                playerSetup.createCharacterSheet(socket, playerInfo);
                            } else {
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
        sex: function(sex) {
            switch (sex) {
                case 'm':
                case 'male':
                    return 'Male       ';
                case 'F':
                case 'female':
                    return 'Female     ';
                    return false;
            }
        },
        createCharacterSheet: function(socket, characterData) {
            var playerData = JSON.parse(modules.data.loadFile('Game/Core/PlayerSetup/', 'blankChar.json'));

            var classRoll = {
                fighter: 12,
                mage: 6,
                thief: 8,
                cleric: 8
            };

            var manaRoll = {
                mage: characterData.int,
                cleric: characterData.wis
            }

            var classDie = classRoll[characterData.class];
            var manaDie = classRoll[manaRoll];

          //  console.log(classDie);
           // console.log(manaDie);
            var hp = modules.helper.dice(1, 12);
             //   hp += Math.floor((Math.random() * characterData.con) + 1);

            //var mana = modules.helper.dice(1, 10);
            //  //  mana += Math.floor((Math.random() * manaDie) + 1);

            // items:
            // {
            //     0:
            //      {
            //         id: JSON.parse(weapons)[0].id,
            //         name: JSON.parse(weapons)[0].name
            //     },
            // }

            var classXP = {
                fighter: 2000,
                cleric: 2500,
                Mage: 3000,
                Thief: 1500,
            }

            playerData.name = characterData.name;
            playerData.password = "123";
            playerData.sex = characterData.sex.trim();
            playerData.information.level = 1;
            playerData.information.race = characterData.race;
            playerData.information.class = characterData.class;
            playerData.information.stats.strength = characterData.str;
            playerData.information.stats.dexterity = characterData.dex;
            playerData.information.stats.constitution = characterData.con;
            playerData.information.stats.intelligence = characterData.int;
            playerData.information.stats.wisdom = characterData.wis;
            playerData.information.stats.charisma = characterData.cha;
            playerData.information.hitpoints = 30 + hp;
            playerData.information.maxHitpoints = 30 + hp;
            playerData.information.mana = 100; // casters all start with 100 mana
            playerData.information.maxMana = 100;
            playerData.information.moves = 100;
            playerData.information.maxMoves = 100;
            playerData.information.alignmentScore = 0;
            playerData.information.alignment = 'Neutral';
            playerData.information.experience = 0;
            playerData.information.experienceToNextLevel = classXP[characterData.class];
            playerData.explored = 1;
            playerData.totalRooms = 2; //hardcode for now eek!
            playerData.gold = 0;
            playerData.silver = 150;
            playerData.copper = 0;
            playerData.location.region = 'valston';
            playerData.location.area = 'prison';
            playerData.hitroll = 1; //hard coded until formula is worked out
            playerData.damroll = 1; //hard coded until formula is worked out
            playerData.wimpy = 30;
            playerData.hours = 0;
            playerData.mkills = 0;
            playerData.mDeaths = 0;
            playerData.pkKills = 0;
            playerData.pkDeaths = 0;
            playerData.pkPoints = 0;
            playerData.weight = 0;
            playerData.maxWeight = parseInt(characterData.str) * 5;
            playerData.wimpy = 25;
            playerData.status = 'Standing';


            var PC = new modules.playerSetup.playerChar(playerData);
            PC.setSocket(socket);
            modules.data.savePlayer(playerData);
            console.log('player saved');
            modules.playerSetup.player.addPlayer(socket);
            socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.loadRoom(PC));
        }
    };
    exports.playerSetup = playerSetup;
})(require);
