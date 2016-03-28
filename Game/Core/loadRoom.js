(function(r)
{
    "use strict";

    var modules = {
        data: r('./data'),
        helper: r('./helpers'),
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

        loadRoom: function (pc, dir, status) {

        
     
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

            console.log("players in room " + room.players)
            console.log("status is " + status)


            if (status == 'load') {
                console.log("staus load")
                var playersInRoom = room.players;
                console.log(playersInRoom)
                console.time('enter')
                socket.emit('enterRoom', modules.events.enterRoom.enterRoom(pc, dir, status, playersInRoom));
               
                    console.timeEnd('enter')
            }

            if (status != 'leave') {
                console.log("staus !leave")
                console.time('addPlayer')
                socket.emit('addPlayer', modules.playerSetup.player.playerManager.addPlayerToRoom(pc, region, area, areaId));
                console.timeEnd('addPlayer')
            }
            else {
                console.log("staus remove")
                socket.emit('removePlayer', modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, room.players));
            }


             socket.emit('look', modules.events.look.look(socket, pc));

            //show prompt on load
            if (status == 'load') {
                 console.log("staus load")
                modules.helper.helpers.send(socket, pc.getPrompt(true));
            }
 
            socket.emit('parseInput', modules.commands.commands.parseInput(pc));


            socket.on('close', function()
            {
                modules.playerSetup.player.playerManager.removePlayer(socket);
                modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, room.players);
                console.log("Telnet Player left - removed from room");
            });

            socket.on('disconnect', function () {
                modules.playerSetup.player.playerManager.removePlayer(socket);
                modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, room.players);
                console.log("Web Player left - removed from room");
            });

        }
    }

})(require);
