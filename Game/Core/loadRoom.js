(function(r)
{
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers').helpers,
        commands: r('./commands'),
        events: {
            enterRoom: r('./Events/enterRoom'),
            exits: r('./Events/findExits'),
            look: r('./Events/look'),
        },
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
 
    };
    exports.playerLocation = {

        loadRoom: function(pc, dir, status) {
            console.log("loadRoom");

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
                socket.emit('enterRoom', modules.events.enterRoom.enterRoom(pc, dir, status, playersInRoom));
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


 
            socket.emit('look', modules.events.look.look(socket, pc));
 
            socket.emit('parseInput', modules.commands.commands.parseInput(pc));


            socket.on('close', function()
            {
                modules.playerSetup.player.playerManager.removePlayer(socket);
                modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);
                console.log("Player left - removed from room");
            });

        }
    }

})(require);
