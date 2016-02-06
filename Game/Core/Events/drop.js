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
            findObject: r('./findObject'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var drop = function (socket, playerInfo, item) {


        var location = JSON.parse(playerInfo.getLocation());
        var room = modules.room.room.playerLocation(location);

        console.time('Drop');

        modules.events.findObject.findObject(playerInfo, room, item, 'drop');

        console.timeEnd('Drop');

    }
    exports.drop = drop;
})(require);