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
        welcome: function(socket) {
            //  var motd = modules.data.loadFile(null, 'motd');
            //
            //   if (motd) {
            //       modules.helper.send(socket, motd);
            //   }
            playerSetup.login(socket);
        },
        login: function(socket) {
            modules.helper.send(socket, "What's your name?");
            //TODO:Check data if name does't exit create a new character
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
            // items:
            // {
            //     0:
            //      {
            //         id: JSON.parse(weapons)[0].id,
            //         name: JSON.parse(weapons)[0].name
            //     },
            // }
            playerData.name = characterData.name;
            playerData.password = "123";
            playerData.information.level = 1;
            playerData.information.race = characterData.race;
            playerData.information.class = characterData.class;
            playerData.information.stats.strength = ' ' + characterData.str + ' ';
            playerData.information.stats.dexterity = ' ' + characterData.dex+ ' ';
            playerData.information.stats.constitution = ' ' + characterData.con+ ' ';
            playerData.information.stats.intelligence = ' ' + characterData.int+ ' ';
            playerData.information.stats.wisdom = ' ' + characterData.wis+ ' ';
            playerData.information.stats.charisma = ' ' + characterData.cha+ ' ';
            playerData.gold = 50;
            playerData.location.region = 'valston';
            playerData.location.area = 'prison';
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
