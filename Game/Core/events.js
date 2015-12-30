(function(r) {
  "use strict";

  var modules = {
    helper: r('./helpers').helpers,
    commands: r('./commands').commands,
    playerSetup: {
      player: r('./PlayerSetup/player-manager')
    },
    loadPlayerLocation: r('./loadRoom')
  };

  var events = {
    move: function(player, nextRoom) {

      var socket = player.getSocket();



      player.setLocation(nextRoom.region, nextRoom.area, nextRoom.areaID)

      console.log(player.location.areaID)

     socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.playerLocation.loadRoom(player));

    },
    look: function(socket, playerInfo, room) {

      try {
        var name = playerInfo.getName();


        //broadcast to all that player looked around
        modules.helper.send(socket, 'You look around');

        modules.helper.send(socket, room.title);
        modules.helper.send(socket, room.description);
        modules.helper.send(socket, 'Exits: [' + room.exits.n.name + ']');

        room.players.forEach(function (playersInRoom) {

          var playerName = playersInRoom.getName();
          var playerSocket = playersInRoom.getSocket();
          if (name !== playerName) {
            modules.helper.send(socket, playerName + " is here.");
            modules.helper.send(playerSocket, name + ' looks around')
          }


        });
      }
      catch(e){"error " + console.log(e)}

    }

  };
  exports.events = events;
})(require);
