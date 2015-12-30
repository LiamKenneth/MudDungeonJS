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
        //get exits
       var exits = events.exits(room.exits)

      

        //broadcast to all that player looked around
        modules.helper.send(socket, 'You look around');

        modules.helper.send(socket, room.title);
        modules.helper.send(socket, room.description);
        modules.helper.send(socket, 'Exits: [' + exits.exits + ']');

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

    },
    exits: function(exits) {



      var exitCount = exits.length;
      var exitObj = {}
      exitObj.exits = [];

      while (exitCount--) {

        var exitName = exits[exitCount].name;

        exitObj.exits.push(exitName);

        exitObj[exitName] = {
          region: exits[exitCount].location.region,
          area: exits[exitCount].location.area,
          areaID: exits[exitCount].location.areaID
        };

console.log(exitObj)
      }

      return exitObj;

    }

  };
  exports.events = events;
})(require);
