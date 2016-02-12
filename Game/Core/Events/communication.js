(function (r) {
    "use strict";

    var modules = {
        constants: r('../constants'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        loadPlayerLocation: r('../loadRoom'),
        helper: r('../helpers')
    };

    // Basic channel functionality.  All player to player communication should funnel through here theoretically.
    var communicate = function (socket, playerInfo, communicationType, msg) {
        msg = msg.toString().trim();

        // Find the index of the first space.  If it doesn't exist then there is no argument and we can toggle the channel.
        var index = msg.indexOf(' ');
        var response;

        // Toggle the channel if there is no argument
        // Trim 'msg' down to the argument
        msg = msg.substr(index + 1);
        
        // Check the channel
        // If the argument is empty, flip flop the channel
        // If not, set the response for later
        switch (communicationType) {
            case modules.constants.channel_gossip:
                if (index < 0) {
                    if (playerInfo.channels.gossip) {
                        modules.helper.helpers.send(socket, 'Gossip channel disabled.');
                    }
                    else {
                        modules.helper.helpers.send(socket, 'Gossip channel enabled.');
                    }

                    playerInfo.channels.gossip ^= true;
                    return;
                }

                response = {
                    "forChannel": playerInfo.name + ' gossips \'' + msg + '\'',
                    "forPlayer": 'You gossip \'' + msg + '\''
                };
                break;
            case modules.constants.channel_clan:
                if (index < 0) {
                    if (playerInfo.channels.clan) {
                        modules.helper.helpers.send(socket, 'Clan channel disabled.');
                    }
                    else {
                        modules.helper.helpers.send(socket, 'Clan channel enabled.');
                    }

                    playerInfo.channels.clan ^= true;
                    return;
                }

                response = {
                    "forChannel": playerInfo.name + ' clans \'' + msg + '\'',
                    "forPlayer": 'You clan \'' + msg + '\''
                };
                break;
            case modules.constants.channel_auction:
                if (index < 0) {
                    if (playerInfo.channels.auction) {
                        modules.helper.helpers.send(socket, 'Auction channel disabled.');
                    }
                    else {
                        modules.helper.helpers.send(socket, 'Auction channel enabled.');
                    }

                    playerInfo.channels.auction ^= true;
                    return;
                }

                response = {
                    "forChannel": playerInfo.name + ' auctions \'' + msg + '\'',
                    "forPlayer": 'You auction \'' + msg + '\''
                };
                break;
            case modules.constants.channel_ask:
                if (index < 0) {
                    if (playerInfo.channels.ask) {
                        modules.helper.helpers.send(socket, 'Ask channel disabled.');
                    }
                    else {
                        modules.helper.helpers.send(socket, 'Ask channel enabled.');
                    }

                    playerInfo.channels.ask ^= true;
                    return;
                }

                response = {
                    "forChannel": playerInfo.name + ' asks \'' + msg + '\'',
                    "forPlayer": 'You ask \'' + msg + '\''
                };
                break;
            case modules.constants.channel_newbie:
                if (index < 0) {
                    if (playerInfo.channels.newbie) {
                        modules.helper.helpers.send(socket, 'Newbie channel disabled.');
                    }
                    else {
                        modules.helper.helpers.send(socket, 'Newbie channel enabled.');
                    }

                    playerInfo.channels.newbie ^= true;
                    return;
                }

                response = {
                    "forChannel": playerInfo.name + ' newbies \'' + msg + '\'',
                    "forPlayer": 'You newbie \'' + msg + '\''
                };
                break;
        }

        // Broadcast the message to all those who are subscribed to the channel
        modules.playerSetup.player.playerManager.broadcastToChannel(playerInfo, msg, communicationType, response);
    }
    exports.communicate = communicate;
})(require);
