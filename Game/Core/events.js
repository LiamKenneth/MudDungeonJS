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
        enterRoom: function(player, direction, status)
        {
            var name = player.getName();
            var pace = 'walks';
            var dir = direction || 'load'; // prev location
            var enterMessage =
            {
                load: name + ' has appeared',
                enter: name + ' ' + pace + ' in from the ' + dir,
                leave: name + ' ' + pace + ' ' + dir
            };



            modules.playerSetup.player.playerManager.broadcast(enterMessage[status]);

        },
        move: function(player, direction, nextRoom)
        {

            var socket = player.getSocket();

            var location = JSON.parse(player.getLocation());
console.log('pc loc ' + location.region)
            var region = location.region;
            var area = location.area;
            var areaId = location.areaID;
            modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, region, area, areaId);
            var room = modules['world'][region][area][areaId];
            console.time("exits")
            var exits =  events.exits(room.exits);

            console.timeEnd("exits")
            try {

                events.enterRoom(player, direction, 'leave')

                player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);

                console.log(player.location.areaID)

                socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player, direction, 'join'));
            }
            catch (e) {
                console.log(e)
            }

        },
        look: function(socket, playerInfo, room)
        {

            try
            {
                var name = playerInfo.getName();
                //get exits
                var exits = events.exits(room.exits)



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
            }
            catch (e)
            {
                "error " + console.log(e)
            }

        },
        exits: function(exits)
        {

console.log("rm exits" + JSON.stringify(exits))

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
