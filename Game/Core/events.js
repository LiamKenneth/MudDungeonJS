(function(r) {
        "use strict";

        var modules = {
            helper: r('./helpers'),
            data: r('./data').data,
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
                    console.log(name + " " + playerName)
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

                var region = location.region;
                var area = location.area;
                var areaId = location.areaID;
                var room = modules['world'][region][area][areaId];


                console.log("Checking if exit exists" + room  + " " +  direction.toLowerCase().charAt(0) + " " + direction + " " + room.exits + " hard code " + room.exits.n);

                if (room.exits.hasOwnProperty(direction)) {

                        if (room.exits[direction].locked === false) {


                            events.enterRoom(player, direction, 'leave', room.players)

                            modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, region, area, areaId);

                            var exits = events.exits(room.exits);

                            try {

                                player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);
                                var nextRoom = modules['world'][exits[direction].region][exits[direction].area][exits[direction].areaID];
                                events.enterRoom(player, direction, 'enter', nextRoom.players)

                                socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player, direction, 'join'));
                            } catch (e) {
                                console.log(e)
                            }
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

                        console.log(preposition + " " + item)

                        var name = playerInfo.getName();
                        var location = JSON.parse(playerInfo.getLocation());

                        var region = location.region;
                        var area = location.area;
                        var areaId = location.areaID;
                        var room = modules['world'][region][area][areaId];

                        var exits = events.exits(room.exits);



                        //broadcast to all that player looked around
                        modules.helper.helpers.send(socket, 'You look around');

                        modules.helper.helpers.send(socket, room.title);
                        modules.helper.helpers.send(socket, room.description);
                        modules.helper.helpers.send(socket, 'Exits: [' + exits.exits + ']');

                        room.players.forEach(function(playersInRoom) {

                            var playerName = playersInRoom.getName();
                            var playerSocket = playersInRoom.getSocket();
                            if (name !== playerName) {
                                modules.helper.helpers.send(socket, playerName + " is here.");
                                modules.helper.helpers.send(playerSocket, name + ' looks around')
                            }


                        });


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

                    var scoreSheet =  modules.data.loadFile(null, 'score');

                    var name = player.getName();
                    var description = player.getDescription();


                    var playerScore = scoreSheet.replace("#Player name#", name);
                  /// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings scoreSheet.replace("#desc#", description);

                    modules.helper.helpers.send(socket, playerScore);

                    }

            };
            exports.events = events;
        })(require);
