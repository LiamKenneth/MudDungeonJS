﻿(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
        room: r('../Rooms/roomFunctions'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        commands: r('../commands'),
        events: {
            enterRoom: r('./enterRoom'),
            exits: r('./findExits'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };


var findObject = function (playerInfo, room, item, event) {

    console.log("find object " + item + "/" + event)


    item = item.trim().toLowerCase();
    var name = playerInfo.getName();
    var socket = playerInfo.getSocket();
    var roomItems = room.items;

   
    roomItems.push({type: 'player', keywords: ['self'], name:playerInfo.name, description: playerInfo.description});
    var playersInRoom = room.players;

    Array.prototype.push.apply(roomItems, playersInRoom);

 

    var roomItemsLength = roomItems.length;


    var itemKeywords;
    var findNthItem;
    var found = false;
    var multi = false;
    if (/^\d+\./.test(item)) {
              
        findNthItem = parseInt(item.split('.')[0], 10);
        multi = true;
        item = item.split('.')[1];
    }


    var eventLookUp = {
        "look at": function (item) {

            var description = item.description.look;

            var response = {
                "forRoom": name + ' looks at a ' + item.name,
                "forPlayer": 'You look at a ' + item.name
            };

            if (item.type == 'object') {

                // change a to an if item.name starts with a vowel a,e,i,o,u 
                // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                var itemNameStartsWith = item.name.substr(0,1).toLowerCase();
 

                if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                    response.forRoom = name + ' looks at an ' + item.name;
                    response.forPlayer = 'You look at an ' + item.name;

                } else {

                    response.forRoom = name + ' looks at a ' + item.name;
                    response.forPlayer = 'You look at a ' + item.name;
                }

                      
            } else {
                     
                if (item.name == playerInfo.name || item.name == 'self') {
                    var sex = playerInfo.sex == 'Male' ? 'himself.' : 'herself.';
                    response.forRoom = name + ' looks at ' + sex;
                    response.forPlayer = 'You look at yourself';
                }
                else {

                    response.forRoom = name + ' looks at ' + item.name;
                    response.forPlayer = 'You look at ' + item.name;
                }

                description = item.description || playerInfo.description;

            };


            modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

            modules.helper.helpers.send(socket, description);

        },
        "look in": function (item) {

            var response = {
                "forRoom": '',
                "forPlayer": ''
            }

            //if item is a container
            if (item.actions.container == true) {

                //get container items array
                var containerItems = item.items;


                var containerItemCount = containerItems.length;

                if (item.actions.locked == true) {

                    response.forRoom = name + ' tries to open the ' + item.name + ' but it\'s locked';
                    response.forPlayer = 'You attempt to open the ' + item.name + ' but it\'s locked';

                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                } else {

                    if (containerItemCount > 0) {

                        response.forRoom = name + ' looks inside a ' + item.name;
                        response.forPlayer = 'You look inside the ' + item.name + ' and see:';

                        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                        var chestItems = '';

                        for (var j = 0; j < containerItemCount; j++) {

                            if (item.items[j].count > 1) {

                                chestItems += item.items[j].name + ' (' + item.items[j].count + ')\r\n';

                            } else {
                                chestItems += item.items[j].name + '\r\n';
                            }

                        }

                        modules.helper.helpers.send(socket, chestItems);

                    } else {

                        response.forRoom = name + ' looks inside a ' + item.name;
                        response.forPlayer = 'You look inside the ' + item.name + ' but nothing is inside';

                        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
                    }

                }

            } else {
                modules.helper.helpers.send(socket, "A " + item.name + " is not a container");

                response.forRoom = name + ' tries to look inside a ' + item.name;
                response.forPlayer = "A " + item.name + " is not a container";

                modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);
            }

        },
        "exam": function (item) {

            console.log('inside exam function')

            var description = item.description.exam;

            var response = {
                "forRoom": name + ' takes a closer look at a ' + item.name,
                "forPlayer": 'You take a closer look at a' + item.name
            };

            if (item.type == 'object') {

                // change a to an if item.name starts with a vowel a,e,i,o,u 
                // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                    response.forRoom = name + ' takes a closer look at an ' + item.name;
                    response.forPlayer = 'You take a closer look at an ' + item.name;

                } else {

                    response.forRoom = name + ' takes a closer look at a ' + item.name;
                    response.forPlayer = 'You take a closer look at a ' + item.name;
                }


            } else {

                if (item.name == playerInfo.name || item.name == 'self') {
                    var sex = playerInfo.sex == 'Male' ? 'himself.' : 'herself.';
                    response.forRoom = name + ' looks at ' + sex;
                    response.forPlayer = 'You look at yourself';
                }
                else {

                    response.forRoom = name + ' looks at ' + item.name;
                    response.forPlayer = 'You look at ' + item.name;
                }

                description = item.description || playerInfo.description;

            };


            modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

            modules.helper.helpers.send(socket, description);

        },
        "get": function(item) {

            console.log('inside get function');

            var description = item.name;

            var response = {
                "forRoom": name + ' gets a  ' + item.name,
                "forPlayer": 'You get a' + item.name
            };

            if (item.type == 'object') {

                // change a to an if item.name starts with a vowel a,e,i,o,u 
                // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                    response.forRoom = name + ' gets an ' + item.name;
                    response.forPlayer = 'You get an ' + item.name;

                } else {

                    response.forRoom = name + ' gets a ' + item.name;
                    response.forPlayer = 'You get a ' + item.name;
                }


            }  


            modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);



            playerInfo.inventory.push(item);

            // remove item from room
            //save room
            // save player!?
        }
    }



    for (var i = 0; i < roomItemsLength; i++) {

        if (found == false) {
            itemKeywords = roomItems[i].keywords;
               
            if (multi && itemKeywords.indexOf(item) > -1) {

                if (findNthItem == i -1) {

                    eventLookUp[event](roomItems[i]);

                    found = true;

                }

            } else if (multi == false && itemKeywords.indexOf(item) > -1) {
    
                eventLookUp[event](roomItems[i]);

                found = true;

            }

        } 

    }

    //another for loop but for players and inventory if it's not found in room?

    if (!found) {
        modules.helper.helpers.send(socket, 'Sorry you don\'t see that here');
    }

}

    exports.findObject = findObject;
})(require);