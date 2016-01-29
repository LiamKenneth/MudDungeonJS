(function (r) {
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
        enterRoom: function (player, direction, status, playersInRoom) {
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


            playersInRoom.forEach(function (playersInRoom) {

                var playerName = playersInRoom.getName();

                if (name !== playerName) {
                    var playersSocket = playersInRoom.getSocket();
                    modules.helper.helpers.send(playersSocket, enterMessageOther[status])
                } else {
                    modules.helper.helpers.send(socket, enterMessageSelf[status])
                }


            });

        },
        move: function (player, direction) {

            console.time('move')

            var socket = player.getSocket();

            var location = JSON.parse(player.getLocation());

            var room = modules.room.room.playerLocation(location);

            if (!!room.exits[direction]) {

                if (room.exits[direction].locked === false) {


                    events.enterRoom(player, direction, 'leave', room.players);

                    modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, room);

                    var exits = events.exits(room.exits);


                    player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);

                    var nextRoom = modules['world'][exits[direction].region][exits[direction].area][exits[direction].areaID];

                    events.enterRoom(player, direction, 'enter', nextRoom.players);

                    console.timeEnd('move')
                    socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player, direction, 'join'));

                } else {
                    modules.helper.helpers.send(socket, 'The exit is locked');
                    //Wait for new command
                    socket.emit('parseInput', modules.commands.commands.parseInput(player));
                }


            } else {
                modules.helper.helpers.send(socket, 'There doesn\'t seem to be an exit this way.');
                //Wait for new command
                socket.emit('parseInput', modules.commands.commands.parseInput(player));
            }

        },
        findObject: function (playerInfo, room, item, event) {

          console.log("find object " + item + "/" + event)


            item = item.trim().toLowerCase();
            var name = playerInfo.getName();
            var socket = playerInfo.getSocket();
            var roomItems = room.items;

   
            roomItems.push({type: 'player', keywords: ['self'], name:playerInfo.name, description: playerInfo.description});
            var playersInRoom = room.players;

            Array.prototype.push.apply(roomItems, playersInRoom);

 

            var roomItemsLength = roomItems.length;


            var itemKeywords;
            var findNthItem;
            var found = false;
            var multi = false;
            if (/^\d+\./.test(item)) {
              
                findNthItem = parseInt(item.split('.')[0], 10);
                multi = true;
                item = item.split('.')[1];
            }


            var eventLookUp = {
                "look at": function (item) {

                    var description = item.description.look;

                    var response = {
                        "forRoom": name + ' looks at a ' + item.name,
                        "forPlayer": 'You look at a ' + item.name
                    };

                    if (item.type == 'object') {

                        // change a to an if item.name starts with a vowel a,e,i,o,u 
                        // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                        var itemNameStartsWith = item.name.substr(0,1).toLowerCase();
 

                        if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                            response.forRoom = name + ' looks at an ' + item.name;
                            response.forPlayer = 'You look at an ' + item.name;

                        } else {

                            response.forRoom = name + ' looks at a ' + item.name;
                            response.forPlayer = 'You look at a ' + item.name;
                        }

                      
                    } else {
                     
                        if (item.name == playerInfo.name || item.name == 'self') {
                            var sex = playerInfo.sex == 'Male' ? 'himself.' : 'herself.';
                            response.forRoom = name + ' looks at ' + sex;
                            response.forPlayer = 'You look at yourself';
                        }
                        else {

                            response.forRoom = name + ' looks at ' + item.name;
                            response.forPlayer = 'You look at ' + item.name;
                        }

                        description = item.description || playerInfo.description;

                    };


                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                    modules.helper.helpers.send(socket, description);

                },
                "look in": function (item) {

                    var response = {
                        "forRoom": '',
                        "forPlayer": ''
                    }

                    //if item is a container
                    if (item.actions.container == true) {

                        //get container items array
                        var containerItems = item.items;


                        var containerItemCount = containerItems.length;

                        if (item.actions.locked == true) {

                            response.forRoom = name + ' tries to open the ' + item.name + ' but it\'s locked';
                            response.forPlayer = 'You attempt to open the ' + item.name + ' but it\'s locked';

                            modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                        } else {

                            if (containerItemCount > 0) {

                                response.forRoom = name + ' looks inside a ' + item.name;
                                response.forPlayer = 'You look inside the ' + item.name + ' and see:';

                                modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                                var chestItems = '';

                                for (var j = 0; j < containerItemCount; j++) {

                                    if (item.items[j].count > 1) {

                                        chestItems += item.items[j].name + ' (' + item.items[j].count + ')\r\n';

                                    } else {
                                        chestItems += item.items[j].name + '\r\n';
                                    }

                                }

                                modules.helper.helpers.send(socket, chestItems);

                            } else {

                                response.forRoom = name + ' looks inside a ' + item.name;
                                response.forPlayer = 'You look inside the ' + item.name + ' but nothing is inside';

                                modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
                            }

                        }

                    } else {
                        modules.helper.helpers.send(socket, "A " + item.name + " is not a container");

                        response.forRoom = name + ' tries to look inside a ' + item.name;
                        response.forPlayer = "A " + item.name + " is not a container";

                        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
                    }

                },
                "exam": function (item) {

                    console.log('inside exam function')

                    var description = item.description.exam;

                    var response = {
                        "forRoom": name + ' takes a closer look at a ' + item.name,
                        "forPlayer": 'You take a closer look at a' + item.name
                    };

                    if (item.type == 'object') {

                        // change a to an if item.name starts with a vowel a,e,i,o,u 
                        // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                        var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                        if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                            response.forRoom = name + ' takes a closer look at an ' + item.name;
                            response.forPlayer = 'You take a closer look at an ' + item.name;

                        } else {

                            response.forRoom = name + ' takes a closer look at a ' + item.name;
                            response.forPlayer = 'You take a closer look at a ' + item.name;
                        }


                    } else {

                        if (item.name == playerInfo.name || item.name == 'self') {
                            var sex = playerInfo.sex == 'Male' ? 'himself.' : 'herself.';
                            response.forRoom = name + ' looks at ' + sex;
                            response.forPlayer = 'You look at yourself';
                        }
                        else {

                            response.forRoom = name + ' looks at ' + item.name;
                            response.forPlayer = 'You look at ' + item.name;
                        }

                        description = item.description || playerInfo.description;

                    };


                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                    modules.helper.helpers.send(socket, description);

                },
                "get": function(item) {

                    console.log('inside get function');

                    var description = item.name;

                    var response = {
                        "forRoom": name + ' gets a  ' + item.name,
                        "forPlayer": 'You get a' + item.name
                    };

                    if (item.type == 'object') {

                        // change a to an if item.name starts with a vowel a,e,i,o,u 
                        // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                        var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                        if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                            response.forRoom = name + ' gets an ' + item.name;
                            response.forPlayer = 'You get an ' + item.name;

                        } else {

                            response.forRoom = name + ' gets a ' + item.name;
                            response.forPlayer = 'You get a ' + item.name;
                        }


                    }  


                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);



                    playerInfo.inventory.push(item);

                    // remove item from room
                    //save room
                    // save player!?
                }
            }



            for (var i = 0; i < roomItemsLength; i++) {

                if (found == false) {
                    itemKeywords = roomItems[i].keywords;
               
                    if (multi && itemKeywords.indexOf(item) > -1) {

                        if (findNthItem == i -1) {

                            eventLookUp[event](roomItems[i]);

                            found = true;

                        }

                    } else if (multi == false && itemKeywords.indexOf(item) > -1) {
    
                        eventLookUp[event](roomItems[i]);

                        found = true;

                    }

                } 

            }

            //another for loop but for players and inventory if it's not found in room?

            if (!found) {
                modules.helper.helpers.send(socket, 'Sorry you don\'t see that here');
            }

        },
        exam: function (socket, playerInfo, item) {

                var location = JSON.parse(playerInfo.getLocation());
                var room = modules.room.room.playerLocation(location);

                console.time('Examine');

                events.findObject(playerInfo, room, item, 'exam');

                console.timeEnd('Examine');
 
        },
        look: function (socket, playerInfo, preposition, item) {


            //console.log(preposition + " " + item)

            var name = playerInfo.getName();
            var location = JSON.parse(playerInfo.getLocation());

            var room = modules.room.room.playerLocation(location);

            if (preposition == null && item == null) {

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

            } else if (preposition == null && item != null) {

                console.time('look without at');

                events.findObject(playerInfo, room, item, 'look at');

                console.timeEnd('look without at');
            }
            else if (preposition == 'at') {

                console.time('lookAt');

                events.findObject(playerInfo, room, item, 'look at');

                console.timeEnd('lookAt');

            } else if (preposition == 'in') {

                console.time('lookIn');

                events.findObject(playerInfo, room, item, 'look in');

                console.timeEnd('lookIn');
            } else if (preposition == 'exam') {
                console.time('exam');

                events.findObject(playerInfo, room, item, 'exam');

                console.timeEnd('exam');
            }


        },
        exits: function (exits) {



            var exitObj = new Object;

            exitObj.exits = [];

            if (!!exits['North']) {
                exitObj.exits.push('North');
                exitObj.North = {
                    region: exits.North.location.region,
                    area: exits.North.location.area,
                    areaID: exits.North.location.areaID
                };
            }
            if (!!exits['East']) {
                exitObj.exits.push('East');
                exitObj.East = {
                    region: exits.East.location.region,
                    area: exits.East.location.area,
                    areaID: exits.East.location.areaID
                };
            }
            if (!!exits['South']) {
                exitObj.exits.push('South');
                exitObj.South = {
                    region: exits.South.location.region,
                    area: exits.South.location.area,
                    areaID: exits.South.location.areaID
                };
            }
            if (!!exits['West']) {
                exitObj.exits.push('West');
                exitObj.West = {
                    region: exits.West.location.region,
                    area: exits.West.location.area,
                    areaID: exits.West.location.areaID
                };
            }




            return exitObj;

        },
        score: function (socket, player) {
            console.time('Score')
            var scoreSheet = modules.data.loadFile(null, 'score');


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
                    } catch (e) {
                        console.log(e)
                    }
                } else if (position == 'right') {
                    try {
                        return (value.toString().length < length) ? pad(value + " ", length, 'right') : value;
                    } catch (e) {
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
                pAge: pad(age, 10, 'right'),
                pHP: pad(info.information.hitpoints, 5, 'left'),
                HPMax: pad(info.information.maxHitpoints, 5, 'right'),
                pMana: pad(info.information.mana, 5, 'left'),
                ManaMax: pad(info.information.maxMana, 5, 'right'),
                pMoves: pad(info.information.moves, 5, 'left'),
                MovesMax: pad(info.information.maxMoves, 5, 'right'),
                pLevel: pad(level, 10, 'right'),
                pAlign: pad(info.information.alignment, 12, 'right'),
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
                pGold: pad(info.gold, 11, 'left'),
                pSilver: pad(info.silver, 11, 'left'),
                pCopper: pad(info.copper, 11, 'left'),
                pExplore: pad(info.explored, 5, 'left'),
                pHitRoll: pad(info.hitroll, 5, 'left'),
                pDamRoll: pad(info.damroll, 5, 'left'),
                pHours: pad(info.hours, 12, 'left'),
                pMkills: pad(info.mkills, 5, 'left'),
                pMDeaths: pad(info.mDeaths, 5, 'left'),
                pWeight: pad(info.weight, 3, 'left'),
                maxWeight: pad(info.maxWeight, 3, 'right'),
                pStatus: pad(info.status, 12, 'right'),
                pWimpy: pad(info.wimpy, 12, 'right'),
                pPKills: pad(info.pkKills, 5, 'left'),
                pPKDeaths: pad(info.pkKills, 5, 'left'),
                pDeaths: pad(info.pkDeaths, 5, 'left'),
                pPKPoints: pad(info.pkPoints, 5, 'left'),
            };

            scoreSheet = scoreSheet.replace(/(pName)|(pDesc)|(pAge)|(pWeight)|(maxWeight)|(pStatus)|(pHP)|(HPMax)|(pMana)|(ManaMax)|(pHours)|(pMkills)|(pMDeaths)|(pHitRoll)|(pDamRoll)|(pWimpy)|(pMoves)|(MovesMax)|(pTNL)|(pExplore)|(pSex)|(pGold)|(pCopper)|(pSilver)|(pClass)|(pRace)|(pLevel)|(pAlign)|(pPKills)|(pPKDeaths)|(pPKPoints)|(pStr)|(StrMax)|(pDex)|(dexMax)|(pCon)|(conMax)|(pInt)|(intMax)|(pWis)|(wisMax)|(pCha)|(chaMax)/g, function (matched) {

                return data[matched];
            });
            console.timeEnd('Score')

            /// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings scoreSheet.replace("#desc#", description);

            modules.helper.helpers.send(socket, scoreSheet);


        },
        say: function (socket, playerInfo, msg) {

            msg = msg.substr(msg.indexOf(" ") + 1).trim();

            var response = {
                "forRoom": playerInfo.name + ' says ' + msg,
                "forPlayer": 'You say ' + msg
            };

            var location = JSON.parse(playerInfo.getLocation());
            var room = modules.room.room.playerLocation(location);

            modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
        },
        get: function (socket, playerInfo, item) {


            var location = JSON.parse(playerInfo.getLocation());
             var room = modules.room.room.playerLocation(location);

            console.time('Get');


            events.findObject(playerInfo, room, item, 'get');

            console.timeEnd('Get');

 
        }

    };
    exports.events = events;
})(require);