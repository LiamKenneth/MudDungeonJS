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
        color: r('colors'),
        events: r('./events.js').events

    };
    exports.playerLocation = {

        loadRoom: function (pc) {
            //need to broadcast this
          //  modules.helper.send(socket, 'load room');

            var name = pc.getName();
            var socket = pc.getSocket();
            var location = JSON.parse(pc.getLocation());

console.log(location)

            modules.playerSetup.player.playerManager.broadcast(name + ' has appeared');


            //load room based on player location
            var region = location.region;
            console.log("reg " + region)
            var area = location.area;
            console.log("area " + area)
            var areaId = location.areaID;
            console.log("areaid " + areaId)
            var room = modules['world'][region][area][areaId];

            console.log( room.title)

            modules.playerSetup.player.playerManager.addPlayerToRoom(socket, pc , region, area, areaId);

            socket.emit('look', modules.events.look(socket, pc, room));


            socket.on('data', function(input) {


                if (input.toString().trim() == 'look') {
                    socket.emit('look', modules.events.look(socket, pc, room));


                }
                else if (input.toString().trim() == 'north')
                {
                    var nextRoom = {
                        region: 'valston',
                        area: 'prison',
                        areaID: 1
                    }
                    socket.emit('move', modules.events.move(pc, nextRoom));


                }

                socket.emit('data', { data: "\r\n" + input });
            });

            socket.on('close', function () {
              modules.playerSetup.player.playerManager.removePlayer(socket);
              modules.playerSetup.player.playerManager.removePlayerFromRoom(socket,  pc, region, area, areaId);

              console.log("Player left");
            });

        }
}

})(require);
