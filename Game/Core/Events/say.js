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
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var say = function (socket, playerInfo, msg) {

        msg = msg.toString();

        msg = msg.substr(msg.indexOf(" ") + 1).trim();

        var response = {
            "forRoom": playerInfo.name + ' says ' + msg,
            "forPlayer": 'You say ' + msg
        };

        var location = JSON.parse(playerInfo.getLocation());
        var room = modules.room.room.playerLocation(location);

        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
    }
    exports.say = say;
})(require);