(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data'),
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

                    for (let i = 0; i < roomItemCount; i++) {

                        displayItems += roomItems[i].description.room + '\r\n';

                    }
                }

                modules.helper.helpers.send(socket, displayItems);

                var roomCorpses = room.corpses || 0;
                var roomCorpsesCount = roomCorpses.length;
                var displayCorpses = '';

                if (roomCorpsesCount > 0) {

                    for (let i = 0; i < roomCorpsesCount; i++) {

                        displayCorpses += roomCorpses[i].name + '\r\n';
                    }
                }

                if (displayCorpses !== '') {
                    modules.helper.helpers.send(socket, displayCorpses);
                }

                var roomMobs = room.mobs || 0;
                var roomMobsCount = roomMobs.length;
                var displayMobs = '';

                if (roomMobsCount > 0) {

                    for (let i = 0; i < roomMobsCount; i++) {

                        displayMobs += roomMobs[i].name + ' is here.\r\n';

                    }
                }

                if (displayMobs !== '') {
                    modules.helper.helpers.send(socket, displayMobs);
                }
                

                var roomPlayers = room.players || 0;
                var roomPlayersCount = roomPlayers.length;
                var displayPlayers = '';

                if (roomPlayersCount > 0) {

                    for (let i = 0; i < roomPlayersCount; i++) {

                        var playerName = roomPlayers[i].getName();
                        var playerSocket = roomPlayers[i].getSocket();

                      
                        if (name !== playerName) {
                            displayPlayers += playerName + " is here.\r\n";
                            modules.helper.helpers.send(playerSocket, name + ' looks around.\r\n');
                        }

                    }
                }

                if (displayPlayers !== '') {
                    modules.helper.helpers.send(socket, displayPlayers);
                }
               


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