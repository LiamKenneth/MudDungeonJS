  "use strict";
  var  players = [];

  function removeByValue(arr, val) {
    for(var i=0; i < arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

  exports.playerManager = {

 /**
  * Remove player socket from players array
  * @param player - player socket
  */
  removePlayer: function(player) {
    removeByValue(players, player);
    player.end();
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
	  addPlayerToRoom: function (player, roomID)
	  {
		  players.push(player);
		  console.log(players[0])
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
			player.write("\r\n" + message);
			player.emit('data', { data: message });
		});
	}


};
