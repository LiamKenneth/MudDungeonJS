  "use strict";

  var modules = {
      helper: require('../helpers'),
      loadPlayerLocation: require('../loadRoom').playerLocation,
    constants: require('../constants'),
      world: {
        valston: require('../../World/valston/prison')
      }
  };

  var players = [];

  function removeByValue(arr, val) {
    
      arr = arr || [];
      var arrLength = arr.length || 0;

    for (var i = 0; i <= arrLength; i++) {
        if (arr[i].socket === val) {
            arr.splice(i, 1);
            break;
        } else {
            throw new Error('No such player in players array');
        }
    }
};

  exports.playerManager = {

    loadPlayer: function (pc) {

          var socket = pc.getSocket();
        var newPlayer = pc.getPlayerInfo();

          modules.helper.helpers.send(socket, 'Whats your password');

          socket.once('data', function (input) {

              var password = input.toString().trim().toLowerCase();

              if (password === pc.password) {
                  console.log("player count " + players.length)

                exports.playerManager.each(function (player) {

                    if (player != null) {

                        var loggedInPlayerInfo = player.getPlayerInfo();
                        if (loggedInPlayerInfo.name == newPlayer.name) {
                            var loggedInPlayerSocket = loggedInPlayerInfo.getSocket();
                            modules.helper.helpers.send(loggedInPlayerSocket, 'You have entered the realm again from somewhere else.');

                            //save player before disconnecting? 
                            exports.playerManager.removePlayer(loggedInPlayerSocket);
                        }
                    }
                });
                exports.playerManager.addPlayer(pc);
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
	  removePlayer: function (player) {

	      removeByValue(players, player);

	  
	      exports.playerManager.disconnectPlayer(player);

	  },

	  disconnectPlayer: function (player) {
     
          try {
              player.disconnect(true);

          } catch (e) {
             // throw new Error("error disconecting web socket");
          }

          try {
              player.end();
          } catch (e) {
              //throw new Error("error disconecting telnet socket");
          }
      },

	/**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
    addPlayer: function (player) {
	 players.push(player);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
    addPlayerToRoom: function (player, pc, region, area, areaId) {
        var room = modules['world'][region][area][areaId];

	 room.players.push(pc);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  removePlayerFromRoom: function (socket, playersInRoom) {

      removeByValue(playersInRoom, socket);

	},
  /**
  	 * Returns each player socket from players array
  	 * @param callback returns player sockets from array
  	 */
    each: function (callback) {
  		players.forEach(callback);
    },

   /**
   * Broadcast a message to every player
   * @param string message to broadcast to everyone
   */
    getPlayers: function () {

        return players;
    },

	/**
	 * Broadcast a message to every player
	 * @param string message to broadcast to everyone
	 */
    broadcast: function (message) {

        exports.playerManager.each(function (player) {

            var socket = player.getSocket();
            modules.helper.helpers.send(socket, message);
		});
	},

  /**
   * Broadcast a message to every player
   * @param string message to broadcast to everyone
   */
    broadcastToRoom: function (message, playersInRoom) {

        playersInRoom.forEach(function (playersInRoom) {

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
    broadcastPlayerEvent: function (currentPlayer, playersInRoom, response) {

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
    },

    /*-------------------------------------------------------------------*
  * Broadcast a message onto a specific channel
  * --------------------------------------------------------------------
  * 
  * @param Object currentPlayer - player object file
  * @param string message - Contents of the broadcast message
  * @param int modules.constants.channel_XXX - The channel we're broadcasting to
  * @param Object response - containing the responses to show the user(s)
  * Example response:
  * response = {
  *  forChannel: 'Kevo gossips 'hello world',
  *  forPlayer: 'You gossip 'hello world'
  * }
  * ---------------------------------------------------------------------
  */
    broadcastToChannel: function (currentPlayer, message, channel, response) {
        exports.playerManager.each(function (player) {
            if (player != null) {
                var targetPlayer = player.getPlayerInfo();
                var targetPlayerName = player.name;
                var currentPlayerName = currentPlayer.getName();
                var currentPlayerSocket = currentPlayer.getSocket();
                var targetPlayersSocket = player.getSocket();

                if ((currentPlayerName !== targetPlayerName) &&
                    ((channel == modules.constants.channel_gossip && targetPlayer.channels.gossip) ||
                        (channel == modules.constants.channel_auction && targetPlayer.channels.auction) ||
                        (channel == modules.constants.channel_clan && targetPlayer.channels.clan) ||
                        (channel == modules.constants.channel_ask && targetPlayer.channels.ask) ||
                        (channel == modules.constants.channel_newbie && targetPlayer.channels.newbie))) {
                    modules.helper.helpers.send(targetPlayersSocket, response.forChannel);
                } else {
                    modules.helper.helpers.send(currentPlayerSocket, response.forPlayer);
                }
            }
        });
    }
};
