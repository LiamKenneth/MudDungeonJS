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

var move = function (player, direction) {

    console.time('move')

    var socket = player.getSocket();

    var location = JSON.parse(player.getLocation());

    var room = modules.room.room.playerLocation(location);

    if (!!room.exits[direction]) {

        if (room.exits[direction].locked === false) {


            modules.events.enterRoom.enterRoom(player, direction, 'leave', room.players);

            modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, player, room);

            var exits = modules.events.exits.exits(room.exits);


            player.setLocation(exits[direction].region, exits[direction].area, exits[direction].areaID);

            var nextRoom = modules['world'][exits[direction].region][exits[direction].area][exits[direction].areaID];

            modules.events.enterRoom.enterRoom(player, direction, 'enter', nextRoom.players);

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

}
    exports.move = move;
})(require);