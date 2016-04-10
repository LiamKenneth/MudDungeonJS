(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data'),
        room: r('../Rooms/roomFunctions'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        commands: r('../commands'),
        events: {
            enterRoom: r('./enterRoom'),
            kill: r('./kill'),
            exits: r('./findExits'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };


    var findObject = function (playerInfo, room, item, event) {

        var container = null;

       

        item = item.trim().toLowerCase();
        
        //check if item contains a container e.g get sword chest
        // This gets the last item of a string -> item.split(" ").pop();

        if (item.split(" ").length > 1) {
 
            container = item.split(" ").pop();
           // item = item.match(/"(.*)"|'(.*)'/);
        }
  

        console.log("find object " + item + "/" + event + "/" + container);


        var name = playerInfo.getName();
        var socket = playerInfo.getSocket();
        var roomItems = room.items || [];
        var playersInRoom = room.players || [];
        var mobsInRoom = room.mobs || [];
        var playerInv = playerInfo.getInventory() || [];

        var eq = playerInfo.findEquipment() || [];
        var eqCount = eq.length;

        var allItems = roomItems.concat(playersInRoom, playerInv, mobsInRoom);
        var allItemCount = allItems.length;

        var notFoundMsg = 'Sorry you don\'t see that here';

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

                    var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


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
            "get": function (item, index) {

                console.log('inside get function for ' + item.name);

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

                if (item.location != 'inv') {


                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);


                    var itemLocation = {
                        room: function () { roomItems.splice(index, 1); },
                    };

                    itemLocation.room(index);

                    item.location = 'inv';

                    playerInfo.setInventory(item, 'get');
                } else {
                    modules.helper.helpers.send(socket, 'Sorry you don\'t see that here');
                }

                // remove item from room
                //save room
                // save player!?
            },
            "drop": function (item) {

                console.log('inside drop function');

                var description = item.name;

                var response = {
                    "forRoom": name + ' drops a  ' + item.name,
                    "forPlayer": 'You drop a' + item.name
                };

                if (item.type == 'object') {

                    // change a to an if item.name starts with a vowel a,e,i,o,u 
                    // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                    var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                    if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                        response.forRoom = name + ' drops an ' + item.name;
                        response.forPlayer = 'You drop an ' + item.name;

                    } else {

                        response.forRoom = name + ' drop a ' + item.name;
                        response.forPlayer = 'You drop a ' + item.name;
                    }


                }

                console.log('item location is ' + item.location)
                if (item.location == 'inv') {

                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                    item.location = 'room';
                    room.items.push(item);
                    playerInfo.setInventory(item, 'drop');

                } else {
                    modules.helper.helpers.send(socket, 'Sorry you don\'t have a ' + item.name + ' to drop');
                }


                // remove item from room
                //save room
                // save player!?
            },
            "wear": function (item, index) {
                console.log('inside wear function');


                var response = {
                    "forRoom": name + ' wears a  ' + item.name,
                    "forPlayer": 'You wear a' + item.name
                };

                if (item.type == 'object') {

                    // change a to an if item.name starts with a vowel a,e,i,o,u 
                    // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                    var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                    if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                        response.forRoom = name + ' wears an ' + item.name;
                        response.forPlayer = 'You wear an ' + item.name;

                    } else {

                        response.forRoom = name + ' wears a ' + item.name;
                        response.forPlayer = 'You wear a ' + item.name;
                    }


                }

                if (item.location == 'inv') {

                    if (item.equipable === true) {

                        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);


                        var itemLocation = {
                            inv: function () { playerInv.splice(index, 1); },
                        };

                        itemLocation.inv(index);


                        item.location = 'equiped';

                        playerInfo.setEquipment(item, 'wear');

                    } else {

                        response.forRoom = name + 'tries to wear a ' + item.name;
                        response.forPlayer = 'Sorry ' + item.name + ' cannot be worn';

                        modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);

                    }

                } else {
                    modules.helper.helpers.send(socket, 'Sorry you don\'t have a ' + item.name + ' to wear');
                }
            },
            "remove": function (item, index) {
                console.log('inside remove function');
                console.log(item)

                var response = {
                    "forRoom": name + ' removes a  ' + item.name,
                    "forPlayer": 'You removes a' + item.name
                };

                if (item.type == 'object') {

                    // change a to an if item.name starts with a vowel a,e,i,o,u 
                    // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                    var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                    if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                        response.forRoom = name + ' remove an ' + item.name;
                        response.forPlayer = 'You remove an ' + item.name;

                    } else {

                        response.forRoom = name + ' remove a ' + item.name;
                        response.forPlayer = 'You remove a ' + item.name;
                    }


                }

                if (item.location == 'equiped') {

                    //check if removable? e.g cursed?
                    //if (item.removable === true) {

                    modules.playerSetup.player.playerManager.broadcastPlayerEvent(playerInfo, room.players, response);


                    playerInv.push(item);

                    item.location = 'inv';

                    playerInfo.setEquipment(item, 'remove');

                    //  }

                } else {
                    modules.helper.helpers.send(socket, 'Sorry you don\'t have a ' + item.name + ' to remove');
                }
            },
            "kill": function (item, room) {
  
                var description = item.name;

                var response = {
                    "forRoom": name + ' attack a  ' + item.name,
                    "forPlayer": 'You attack a' + item.name
                };

                if (item.type == 'mob') {

                    // change a to an if item.name starts with a vowel a,e,i,o,u 
                    // EDIT: which can still be incorrect, maybe include an overide or set the action description in the item?

                    var itemNameStartsWith = item.name.substr(0, 1).toLowerCase();


                    if (itemNameStartsWith == 'a' || itemNameStartsWith == 'e' || itemNameStartsWith == 'i' || itemNameStartsWith == 'o' || itemNameStartsWith == 'u') {

                        response.forRoom = name + ' attacks an ' + item.name;
                        response.forPlayer = 'You attack an ' + item.name;

                    } else {

                        response.forRoom = name + ' attacks a ' + item.name;
                        response.forPlayer = 'You attack a ' + item.name;
                    }

                }

                //kill function
                modules.events.kill.kill.initCombat(playerInfo, item, room);

            }
        }

      
            if (event === 'drop' || event === 'wear' || event === 'wield') {
                allItemCount = playerInv.length;
                allItems = playerInv;
            }

            if (event === 'remove') {
                allItemCount = eqCount;
                allItems = eq;
                notFoundMsg = 'Sorry you do not have that equipped';

            }


            var object = item;
            
            if (container !== null) {
                object = container;
                item = item.split(' ').slice(0, 1).join(' ');
 
            }

            //used for keeping count of items looped for all
            var totalAllItems = 0;
            if (object === 'all') {

                if (event === 'drop') {
                    allItems = playerInv;
                } else {
                    allItems = roomItems;
                }
               
                allItemCount = allItems.length;

               console.log("Number of items " + allItemCount)
              
            }

/*
 *  Loop through All Items in the room
 *  =====================================
 *  By default this contains: Items, Players, inventory & Mobs
 *  unless specified for example; if the event is drop, wear or wield these actions 
 *  can only be used on items in the players inventory so allItems will only contain inventory items. (see above)
 * 
 *  if Multi is true it will look for x.item eg. 2.sword will get the 2nd sword in allItems.
 * 
 *  If a container is specified it will look for this 1st then loop through the container items array for the item.
 *  
 *  Currently if you type get long sword it will think sword is a container and will search for it. 
 *  TODO: allow for multiple space keywords e.g get 'long sword' or get "long sword"
 * 
 */

            var containerItems;
            var containerItemsCount;
            var containerKeywords;

            for (var i = 0; i < allItemCount; i++) {

                if (object === 'all') {
                    totalAllItems += 1;

                    if (totalAllItems <= allItemCount) {

                        console.log("look count " + i + "totalI " + totalAllItems);
                        eventLookUp[event](allItems[i], i);

                        i -= 1;
                        found = true;
                    }  

                }
                else {

                if (found === false) {

                
                        itemKeywords = allItems[i].keywords;


                        if (multi && itemKeywords.indexOf(object) > -1) {

                            if (findNthItem === i - 1) {


                                console.log(allItems[i] + "\n\r");

                                if (allItems[i].actions.container === true && container !== null) {

                                    console.log("Is container\r\n");

                                    containerItems = allItems[i].items;
                                    containerItemsCount = containerItems.length;


                                    console.log("items include " + containerItems);

                                    for (let j = 0; j < containerItemsCount; j++) {

                                        containerKeywords = containerItems[j].keywords;

                                        console.log(containerKeywords + " find item " + item);

                                        if (containerKeywords.indexOf(item) > -1) {

                                            console.log("found " + containerItems[j]);

                                            eventLookUp[event](containerItems[j], j);
                                            break;
                                        }

                                    }

                                } else {

                                    eventLookUp[event](allItems[i], i);
                                }

                                found = true;

                            }

                        } else if (multi === false && itemKeywords.indexOf(object) > -1 || object === 'all') {

                            

                            if (allItems[i].actions.container === true && container !== null) {

                                console.log("Is container\r\n");

                                containerItems = allItems[i].items;
                                containerItemsCount = containerItems.length;

                                console.log("items include " + containerItems);

                                for (let j = 0; j < containerItemsCount; j++) {

                                    containerKeywords = containerItems[j].keywords;

                                    console.log(containerKeywords + " find item " + item);

                                    if (containerKeywords.indexOf(item) > -1) {

                                        console.log("found " + containerItems[j]);

                                        eventLookUp[event](containerItems[j], j);
                                        break;
                                    }

                                }

                            } else {
                                eventLookUp[event](allItems[i], i);
                            }


                            found = true;


                        }
                    }
                }
            

        };



        //another for loop but for players and inventory if it's not found in room?

        if (!found) {
            modules.helper.helpers.send(socket, notFoundMsg);
        }



    }

    exports.findObject = findObject;
})(require);