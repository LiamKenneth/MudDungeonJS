(function(r)
{
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers').helpers,
        commands: r('./commands'),
        fs: r('fs'),
        world:
        {
            valston: r('../World/valston/prison')
        },
        playerSetup:
        {
            player: r('./PlayerSetup/player-manager')
        },
        color: r('colors'),
        events: r('./events.js')

    };
    exports.playerLocation = {

        loadRoom: function(pc, dir, status)
        {
            console.log(dir + status)

            var name = pc.getName();
            var socket = pc.getSocket();
            var location = JSON.parse(pc.getLocation());


            //load room based on player location
            var region = location.region;
            //console.log("reg " + region)
            var area = location.area;
            //console.log("area " + area)
            var areaId = location.areaID;
            //console.log("areaid " + areaId)
            var room = modules['world'][region][area][areaId];

           // console.log(room.players)



            if (status == 'load') {
                var playersInRoom = room.players;
                console.time('enter')
                socket.emit('enterRoom', modules.events.events.enterRoom(pc, dir, status, playersInRoom));
                    console.timeEnd('enter')
            }

            if (status != 'leave') {
                console.time('addPlayer')
                socket.emit('addPlayer', modules.playerSetup.player.playerManager.addPlayerToRoom(socket, pc, region, area, areaId));
                console.timeEnd('addPlayer')
            }
            else {
                socket.emit('removePlayer', modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId));
            }



    //console.time('look')
            socket.emit('look', modules.events.events.look(socket, pc));
//console.timeEnd('look')

            socket.emit('parseInput', modules.commands.commands.parseInput(pc));


            socket.on('close', function()
            {
                modules.playerSetup.player.playerManager.removePlayer(socket);
                modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);

                console.log("Player left");
            });

        }
    }

})(require);
