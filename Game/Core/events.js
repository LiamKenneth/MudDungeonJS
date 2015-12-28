(function(r) {
  "use strict";

  var modules = {
    helper: r('./helpers').helpers,
    commands: r('./commands').commands,
    playerSetup: {
      player: r('./PlayerSetup/player-manager')
    },
  };

  var events = {
    look: function(socket, playerInfo, room) {

      var name = playerInfo.getName();

      //broadcast to all that player looked around

      modules.helper.send(socket, room.title.green);
      modules.helper.send(socket, room.description);
      modules.helper.send(socket, 'Exits: [' + room.exits.n.name + ']');

      room.players.forEach(function(playersInRoom) {


          if (name !== playersInRoom.name) {
            modules.helper.send(socket, playersInRoom.name + " is here.");

          }



      });


    }

  };
  exports.events = events;
})(require);
