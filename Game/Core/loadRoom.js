(function(r) {
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers').helpers,
        commands: r('./commands').commands,
        fs: r('fs'),
        world: r('../World/tutorial').tutorial,
        playerSetup: {
            player: r('./PlayerSetup/player-manager')
        },
        color: r('colors')
    };
    exports.playerLocation = {

        loadRoom: function (socket, playerInfo) {
            //need to broadcast this
          //  modules.helper.send(socket, 'load room');

            modules.playerSetup.player.playerManager.broadcast(playerInfo.name + ' has appeared');

            //load room based on player location
            var tutorial = modules.world.rooms;

            socket.write(tutorial.prison.title.green);
            socket.write(tutorial.prison.description);
            socket.write("\r\nExits: []");

            socket.emit('data', { data: tutorial.prison.title.green });
            socket.emit('data', { data: tutorial.prison.description });
            socket.emit('data', { data: 'Exits: []' });

            socket.on('close', function () {
              modules.playerSetup.player.playerManager.removePlayer(socket);

              console.log("Player left");
            });

            //TODO display other players? if in same room
        }
}

})(require);
