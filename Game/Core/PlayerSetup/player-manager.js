  "use strict";

  var modules = {
      helper: require('../helpers'),
      loadPlayerLocation: require('../loadRoom').playerLocation,
      world: {
        valston: require('../../World/valston/prison')
      }
  };

  var players = [];



  function removeByValue(arr, val) {
    
      arr = arr || [];
      var arrLength = arr.length || 0;

    for(var i=0; i < arrLength; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            console.log('removed')
            break;
        }
    }
};

  exports.playerManager = {

	  loadPlayer: function(pc) {

          var socket = pc.getSocket();


          modules.helper.helpers.send(socket, 'Whats your password');

          socket.once('data', function (input) {

              var password = input.toString().trim().toLowerCase();

              if (password === pc.password) {
                  console.log("player count " + players.length)
                  socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.loadRoom(pc, null, 'load'));
              } else {
                  modules.helper.helpers.send(socket, 'Password is wrong');
                  exports.playerManager.loadPlayer(socket, pc);
              }
          });
      },

			  /**
  * Remove player socket from players array
  * @param player - player socket
  */
  removePlayer: function(player) {
      removeByValue(players, player);

      try {
          player.disconnect(true);

    } catch (e) {
        console.log("error disconecting web socket")
    }
          
    try {
        player.end();
    } catch (e) {
        console.log("error disconecting telnet socket")
    }
  },

	/**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  addPlayer: function (player)
	{
	 players.push(player);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  addPlayerToRoom: function (player, pc, region, area, areaId)
	{
        var room = modules['world'][region][area][areaId];
        var name = pc.getName();

	 room.players.push(pc);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  removePlayerFromRoom: function (player, pc, room)
  {


  removeByValue(room.players, pc);

	},
  /**
  	 * Returns each player socket from players array
  	 * @param callback returns player sockets from array
  	 */
   each: function (callback)
  	{
  		players.forEach(callback);
  	},

	/**
	 * Broadcast a message to every player
	 * @param string message to broadcast to everyone
	 */
	broadcast: function (message)
	{

   exports.playerManager.each(function (player)
		{
            modules.helper.helpers.send(player, message);
		});
	},

  /**
   * Broadcast a message to every player
   * @param string message to broadcast to everyone
   */
  broadcastToRoom: function (message, playersInRoom)
  {

      playersInRoom.forEach(function(playersInRoom)
      {

          var player = playersInRoom.getSocket();
          modules.helper.helpers.send(player, message);

      });

  },

 /*-------------------------------------------------------------------*
 * Broadcast an event to the player and other players
 * --------------------------------------------------------------------
 * 
 * Example: You pick up a sword. Others will see: Liam picks up a sword
 * @param Object currentPlayerName - player object file
 * @param array playersInRoom - An array of players in the room
 * @param Object response - containing the responses to show the user(s)
 * Example response:
 * response = {
 *  forRoom: 'Liam picks up a sword',
 *  forPlayer: 'You pick up a sword
 * }
 * 
 * ---------------------------------------------------------------------
 */
  broadcastPlayerEvent: function(currentPlayer, playersInRoom, response) {

      playersInRoom.forEach(function (player) {

          console.log("players " + player.length)

          var playerName = player.name;
          var currentPlayerName = currentPlayer.getName();
          var currentPlayerSocket = currentPlayer.getSocket();

          if (currentPlayerName !== playerName) {
              var playersSocket = player.getSocket();
              modules.helper.helpers.send(playersSocket, response.forRoom);
          } else {
              modules.helper.helpers.send(currentPlayerSocket, response.forPlayer);
          }
      });
  }
  


};
