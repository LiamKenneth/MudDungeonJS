(function(r)
{
    "use strict";

    var modules = {
        helper: r('./helpers'),
        playerSetup:
        {
            player: r('./PlayerSetup/player-manager')
        },
        loadPlayerLocation: r('./loadRoom'),
        world:
        {
            valston: r('../World/valston/prison')
        },
    };

    var events = {
        enterRoom: function(player, direction, status, playersInRoom)
        {
            var name = player.getName();
            var socket = player.getSocket();

           // console.log(socket)
            var pace = 'walk'; //TODO: fix walk and walks
            var dir = direction || 'load'; // prev location
           // var playerInRoomArray = playersInRoom;

            var enterMessageSelf =
            {
                load: 'You have appeared',
                enter: 'You' + ' ' + pace + ' in from the ' + dir,
                leave: 'You' + ' ' + pace + ' ' + dir
            };

            var enterMessageOther =
            {
                load: name + ' has appeared',
                enter: name + ' ' + pace + ' in from the ' + dir,
                leave: name + ' ' + pace + ' ' + dir
            };


            playersInRoom.forEach(function(playersInRoom)
            {

                var playerName = playersInRoom.getName();
                console.log(name + " " + playerName)
                if (name !== playerName)
                {
                    var playersSocket = playersInRoom.getSocket();
                    modules.helper.helpers.send(playersSocket, enterMessageOther[status])
                }
                else {
                   modules.helper.helpers.send(socket, enterMessageSelf[status])
                }


            });

        },
        move: function(player, direction, nextRoom)
        {

            var socket = player.getSocket();

            var location = JSON.parse(player.getLocation());

            var region = location.region;
            var area = location.area;
            var areaId = location.areaID;
            var room = modules['world'][region][area][areaId];
            events.enterRoom(player, direction, 'leave', room.players)

            modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, region, area, areaId);


            var exits =  events.exits(room.exits);

            try {


                player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);
                var nextRoom = modules['world'][exits[direction].region][exits[direction].area][exits[direction].areaID];
                events.enterRoom(player, direction, 'enter', nextRoom.players)

                socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player, direction, 'join'));
            }
            catch (e) {
                console.log(e)
            }

        },
        look: function(socket, playerInfo, preposition, item)
        {

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

                room.players.forEach(function(playersInRoom)
                {

                    var playerName = playersInRoom.getName();
                    var playerSocket = playersInRoom.getSocket();
                    if (name !== playerName)
                    {
                        modules.helper.helpers.send(socket, playerName + " is here.");
                        modules.helper.helpers.send(playerSocket, name + ' looks around')
                    }


                });


        },
        exits: function(exits)
        {

            var exitCount = exits.length;
            var exitObj = {}
            exitObj.exits = [];

            while (exitCount--)
            {

                var exitName = exits[exitCount].name;

                exitObj.exits.push(exitName);

                exitObj[exitName] = {
                    region: exits[exitCount].location.region,
                    area: exits[exitCount].location.area,
                    areaID: exits[exitCount].location.areaID
                };

                console.log("find exit" + exitObj)
            }

            return exitObj;

        }

    };
    exports.events = events;
})(require);
