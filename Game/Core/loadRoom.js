(function(r) {
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers').helpers,
        commands: r('./commands').commands,
        fs: r('fs'),
        world: {
          valston: r('../World/valston/prison')
        },
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
            var region = playerInfo.location.region;
            var area = playerInfo.location.area;
            var areaId = playerInfo.location.areaId;

            var room = modules['world'][region][area][areaId];

            modules.playerSetup.player.playerManager.addPlayerToRoom(socket, playerInfo, region, area, areaId);
              socket.emit('data', { data: room.players.length });

            socket.emit('data', { data: room.title.green });
            socket.emit('data', { data: room.description });
            socket.emit('data', { data: 'Exits: [' + room.exits.n.name + ']'});

            room.players.forEach(function(playersInRoom) {

                  if(playersInRoom.hasOwnProperty('name'))
                  {
                    if (playerInfo.name !== playersInRoom.name) {
                        socket.emit('data', { data: playersInRoom.name + " is here." });
                    }
                }


            });



            socket.on('close', function () {
              modules.playerSetup.player.playerManager.removePlayer(socket);
              modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, playerInfo, region, area, areaId);

              console.log("Player left");
            });

            //TODO display other players? if in same room
        }
}

})(require);
