(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
        room: r('../Rooms/roomFunctions'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        commands: r('../commands'),
        events: {
            enterRoom: r('./enterRoom'),
            exits: r('./findExits'),
            findObject: r('./findObject')
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var look = function (socket, playerInfo, preposition, object) {


            var name = playerInfo.getName();
            var location = JSON.parse(playerInfo.getLocation());

            var room = modules.room.room.playerLocation(location);

            console.log("look " + object)

            var item = object || null;

            if (preposition == null && item == null ) {
                /*
                 * If Preposition is null and Item is null
                 * the user just typed look.
                 */

                var exits = modules.events.exits.exits(room.exits);


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

                room.players.forEach(function(playersInRoom) {

                    var playerName = playersInRoom.getName();
                    var playerSocket = playersInRoom.getSocket();
                    if (name !== playerName) {
                        modules.helper.helpers.send(socket, playerName + " is here.");
                        modules.helper.helpers.send(playerSocket, name + ' looks around');
                    }
                });

            } else if (preposition == null && item != null) {

                console.time('look without at');

                modules.events.findObject.findObject(playerInfo, room, item, 'look at');

                console.timeEnd('look without at');
            } else if (preposition == 'at') {

                console.time('lookAt');

                modules.events.findObject.findObject(playerInfo, room, item, 'look at');

                console.timeEnd('lookAt');

            } else if (preposition == 'in') {

                console.time('lookIn');

                modules.events.findObject.findObject(playerInfo, room, item, 'look in');

                console.timeEnd('lookIn');
            } else if (preposition == 'exam') {
                console.time('exam');

                modules.events.findObject.findObject(playerInfo, room, item, 'exam');

                console.timeEnd('exam');
            }

        }
    
    exports.look = look;
})(require);