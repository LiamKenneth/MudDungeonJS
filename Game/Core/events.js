(function(r) {
        "use strict";

        var modules = {
            helper: r('./helpers'),
            data: r('./data').data,
            room: r('./Rooms/roomFunctions'),
            playerSetup: {
                player: r('./PlayerSetup/player-manager')
            },
            commands: r('./commands'),
            loadPlayerLocation: r('./loadRoom'),
            world: {
                valston: r('../World/valston/prison')
            },
        };

        var events = {
            enterRoom: function(player, direction, status, playersInRoom) {
                var name = player.getName();
                var socket = player.getSocket();

                // console.log(socket)
                var pace = 'walk'; //TODO: fix walk and walks
                var dir = direction || 'load'; // prev location
                // var playerInRoomArray = playersInRoom;

                var enterMessageSelf = {
                    load: 'You have appeared',
                    enter: 'You' + ' ' + pace + ' in from the ' + dir,
                    leave: 'You' + ' ' + pace + ' ' + dir
                };

                var enterMessageOther = {
                    load: name + ' has appeared',
                    enter: name + ' ' + pace + ' in from the ' + dir,
                    leave: name + ' ' + pace + ' ' + dir
                };


                playersInRoom.forEach(function(playersInRoom) {

                    var playerName = playersInRoom.getName();
                
                    if (name !== playerName) {
                        var playersSocket = playersInRoom.getSocket();
                        modules.helper.helpers.send(playersSocket, enterMessageOther[status])
                    } else {
                        modules.helper.helpers.send(socket, enterMessageSelf[status])
                    }


                });

            },
            move: function(player, direction, nextRoom) {

                var socket = player.getSocket();

                var location = JSON.parse(player.getLocation());
                
                var room = modules.room.room.playerLocation(location);

                if (room.exits.hasOwnProperty(direction)) {

                        if (room.exits[direction].locked === false) {


                            events.enterRoom(player, direction, 'leave', room.players)

                            //code breaks here because region etc is not defined. change remove function to just take room param to get the region/area/ area id

                            modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, room);

                            var exits = events.exits(room.exits);


                                player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);

                                var nextRoom = modules['world'][exits[direction].region][exits[direction].area][exits[direction].areaID];
                                events.enterRoom(player, direction, 'enter', nextRoom.players)

                                socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player, direction, 'join'));

                        } else {
                            modules.helper.helpers.send(socket, 'The exit is locked');
                            //Wait for new command
                            socket.emit('parseInput', modules.commands.commands.parseInput(pc));
                        }


                    } else {
                        modules.helper.helpers.send(socket, 'There doesn\'t seem to be an exit this way.');
                        //Wait for new command
                        socket.emit('parseInput', modules.commands.commands.parseInput(player));
                    }

                },
                look: function(socket, playerInfo, preposition, item) {


                        //console.log(preposition + " " + item)

                        var name = playerInfo.getName();
                        var location = JSON.parse(playerInfo.getLocation());

                        var region = location.region;
                        var area = location.area;
                        var areaId = location.areaID;
                        var room = modules['world'][region][area][areaId];

                    if (preposition == null) {

                        var exits = events.exits(room.exits);


                        //broadcast to all that player looked around
                        modules.helper.helpers.send(socket, 'You look around');

                        modules.helper.helpers.send(socket, room.title);
                        modules.helper.helpers.send(socket, room.description);
                        modules.helper.helpers.send(socket, 'Exits: [' + exits.exits + ']');

                        var roomItems = room.items || 0;
                        var roomItemCount = roomItems.length;
                        var displayItems = '';

                        if (roomItemCount > 0) {

                        for (var i = 0; i < roomItemCount; i++) {

                            displayItems += roomItems[i].description.room + '\r\n';

                        }
                    }

                        modules.helper.helpers.send(socket, displayItems);

                        room.players.forEach(function (playersInRoom) {

                            var playerName = playersInRoom.getName();
                            var playerSocket = playersInRoom.getSocket();
                            if (name !== playerName) {
                                modules.helper.helpers.send(socket, playerName + " is here.");
                                modules.helper.helpers.send(playerSocket, name + ' looks around');
                            }
                        });

                    }
                    else if (preposition == 'at') {
                       // console.log(room.items)
                       // console.log(item)
                        console.time('lookAt');

                        var item = item.trim().toLowerCase();

                        var roomItems = room.items;
                        var roomItemCount = roomItems.length;

                        var itemKeywords;
                        var itemKeywordsCount;
                        var found = false;
                        var multi = false;
                        if (/^\d+\./.test(item)) {
                        
                           var findNthItem = parseInt(item.split('.')[0], 10);
                           multi = true;
                            item = item.split('.')[1];
                        }

                       // console.log('items = ' + roomItemCount)
                        for (var i = 0; i < roomItemCount; i++) {

                            if(found == false) {
                                itemKeywords = roomItems[i].keywords;
                                itemKeywordsCount = itemKeywords.length;

                                //console.log('match ' + itemKeywords.indexOf(item))

                                var response = {
                                    "forRoom": name + ' looks at a ' + roomItems[i].name,
                                    "forPlayer": 'You look at a ' + roomItems[i].name
                                }

                                      if (multi && itemKeywords.indexOf(item) > -1) {

                                          if (findNthItem == i) {

                                              modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                                              modules.helper.helpers.send(socket, roomItems[i].description.look);
                                              found = true;
                                              break;
                                          }

                                      }
                                      else if (itemKeywords.indexOf(item) > -1) {
                                          modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                                          modules.helper.helpers.send(socket, roomItems[i].description.look);
                                          found = true;
                                          break;
                                      }

                            }

                        }

                        if (!found) {
                            modules.helper.helpers.send(socket,'Sorry you don\'t see that here');
                        }
console.timeEnd('lookAt');

                    }
                    else if (preposition == 'in') {

                        console.time('lookIn');

                        var item = item.trim().toLowerCase();

                        var roomItems = room.items;
                        var roomItemCount = roomItems.length;

                        var itemKeywords;
                        var itemKeywordsCount;
                        var found = false;

                        // Loops rooms item array for container
                        for (var i = 0; i < roomItemCount; i++) {

                            if (found == false) {
                                itemKeywords = roomItems[i].keywords;
                                itemKeywordsCount = itemKeywords.length;

                                //If item is found via keyword
                                if (itemKeywords.indexOf(item) > -1) {
                                    found = true;

                                    //if item is a container
                                    if (roomItems[i].actions.container == true) {

                                        //get container items array
                                        var containerItems = roomItems[i].items;

                                        console.log(containerItems.name);

                                        var containerItemCount = containerItems.length;

                                        if(roomItems[i].actions.locked == true) {
                                            modules.helper.helpers.send(socket, 'You attempt to open the ' + roomItems[i].name + ' but it\'s locked');
                                        }
                                        else {

                                            if (containerItemCount > 0) {

                                                modules.helper.helpers.send(socket, 'You look inside the ' + roomItems[i].name + ' and see:');

                                                var chestItems = '';

                                                for (var j = 0; j < containerItemCount; j++) {

                                                    if (roomItems[i].items[j].count > 1) {

                                                        chestItems += roomItems[i].items[j].name + ' (' + roomItems[i].items[j].count + ')\r\n';

                                                    }
                                                    else {
                                                        chestItems += roomItems[i].items[j].name + '\r\n';
                                                    }

                                                }

                                                modules.helper.helpers.send(socket, chestItems);

                                            }
                                            else {
                                                modules.helper.helpers.send(socket, 'You look inside the ' + roomItems[i].name + ' but nothing is inside');
                                            }

                                        }

                                    }
                                    else {
                                        modules.helper.helpers.send(socket, "A " + roomItems[i].name + " is not a container");
                                    }
                                }


                            }
                        }

                        if (!found) {
                                modules.helper.helpers.send(socket,'Sorry you don\'t see that here');
                            }

console.timeEnd('lookIn');      
                    }


                    },
                    exits: function(exits) {



                        var exitObj = new Object;

                        exitObj.exits = [];

                        if (exits.hasOwnProperty('North')) {
                            exitObj.exits.push('North');
                            exitObj.North = {
                                region: exits.North.location.region,
                                area: exits.North.location.area,
                                areaID: exits.North.location.areaID
                            };
                        }
                        if (exits.hasOwnProperty('East')) {
                            exitObj.exits.push('East');
                            exitObj.East = {
                                region: exits.East.location.region,
                                area: exits.East.location.area,
                                areaID: exits.East.location.areaID
                            };
                        }
                        if (exits.hasOwnProperty('South')) {
                            exitObj.exits.push('South');
                            exitObj.South = {
                                region: exits.South.location.region,
                                area: exits.South.location.area,
                                areaID: exits.South.location.areaID
                            };
                        }
                        if (exits.hasOwnProperty('West')) {
                            exitObj.exits.push('West');
                            exitObj.West = {
                                region: exits.West.location.region,
                                area: exits.West.location.area,
                                areaID: exits.West.location.areaID
                            };
                        }




                        return exitObj;

                    },
                    score: function(socket, player) {
                            console.time('Score')
                    var scoreSheet =  modules.data.loadFile(null, 'score');


                    var name = player.getName();
                    var desc = player.getDescription();
                    var Class = player.getClass();
                    var race = player.getRace();
                    var age = player.getAge();
                    var level = player.getLevel();
                    var info = player.getPlayerInfo();

                    function pad(value, length, position) {

                        if (position == 'left') {
                            try {
                                return (value.toString().length < length) ? pad(" " + value, length, 'left') : value;
                            }
                            catch (e) {
                                console.log(e)
                            }
                        } else if (position == 'right') {
                            try {
                                return (value.toString().length < length) ? pad(value + " ", length, 'right') : value;
                            }
                            catch (e) {
                                console.log(e)
                            }
                        }
                    }




                    var data = {
                       pName: name,
                       pDesc: desc,
                       pClass: pad(Class, 10, 'right'),
                       pRace: pad(race, 10, 'right'),
                        pSex: pad(info.sex, 10, 'right'),
                       pAge: pad(age,10, 'right'),
                        pHP: pad(info.information.hitpoints, 5, 'left'),
                        HPMax: pad(info.information.maxHitpoints, 5, 'right'),
                        pMana: pad(info.information.mana, 5, 'left'),
                        ManaMax: pad(info.information.maxMana, 5, 'right'),
                        pMoves: pad(info.information.moves,5,'left'),
                        MovesMax: pad(info.information.maxMoves, 5, 'right'),
                       pLevel: pad(level, 10, 'right'),
                       pAlign:  pad(info.information.alignment,12, 'right'),
                        pTNL: pad(info.information.experienceToNextLevel, 11, 'left'),
                       pStr: pad(info.information.stats.strength, 3, 'left'),
                       StrMax: pad(info.information.stats.strength, 3, 'right'),
                       pDex: pad(info.information.stats.dexterity, 3, 'left'),
                       dexMax: pad(info.information.stats.dexterity, 3, 'right'),
                       pCon: pad(info.information.stats.constitution, 3, 'left'),
                       conMax: pad(info.information.stats.constitution, 3, 'right'),
                       pInt: pad(info.information.stats.intelligence, 3, 'left'),
                       intMax: pad(info.information.stats.intelligence, 3, 'right'),
                       pWis: pad(info.information.stats.wisdom, 3, 'left'),
                       wisMax: pad(info.information.stats.wisdom, 3, 'right'),
                       pCha: pad(info.information.stats.charisma, 3, 'left'),
                       chaMax: pad(info.information.stats.charisma, 3, 'right'),
                        pGold: pad(info.gold, 11 , 'left'),
                        pSilver: pad(info.silver, 11 , 'left'),
                        pCopper: pad(info.copper, 11 , 'left'),
                        pExplore: pad(info.explored,5, 'left'),
                        pHitRoll: pad(info.hitroll, 5, 'left'),
                        pDamRoll: pad(info.damroll, 5, 'left'),
                        pHours: pad(info.hours, 12, 'left'),
                        pMkills: pad(info.mkills, 5, 'left'),
                        pMDeaths: pad(info.mDeaths, 5, 'left'),
                        pWeight: pad(info.weight, 3, 'left'),
                        maxWeight: pad(info.maxWeight, 3, 'right'),
                        pStatus: pad(info.status, 12, 'right'),
                        pWimpy: pad(info.wimpy, 12, 'right'),
                        pPKills:  pad(info.pkKills, 5, 'left'),
                        pPKDeaths:  pad(info.pkKills, 5, 'left'),
                        pDeaths:  pad(info.pkDeaths, 5, 'left'),
                        pPKPoints: pad(info.pkPoints, 5, 'left'),
                    };

                    scoreSheet = scoreSheet.replace(/(pName)|(pDesc)|(pAge)|(pWeight)|(maxWeight)|(pStatus)|(pHP)|(HPMax)|(pMana)|(ManaMax)|(pHours)|(pMkills)|(pMDeaths)|(pHitRoll)|(pDamRoll)|(pWimpy)|(pMoves)|(MovesMax)|(pTNL)|(pExplore)|(pSex)|(pGold)|(pCopper)|(pSilver)|(pClass)|(pRace)|(pLevel)|(pAlign)|(pPKills)|(pPKDeaths)|(pPKPoints)|(pStr)|(StrMax)|(pDex)|(dexMax)|(pCon)|(conMax)|(pInt)|(intMax)|(pWis)|(wisMax)|(pCha)|(chaMax)/g, function(matched){

                          return data[matched];
                        });
console.timeEnd('Score')

                  /// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings scoreSheet.replace("#desc#", description);

                    modules.helper.helpers.send(socket, scoreSheet);


                }

            };
            exports.events = events;
        })(require);
