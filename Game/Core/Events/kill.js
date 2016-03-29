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
            exits: r('./findExits'),
            findObject: r('./findObject'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var kill = {

        findMob: function (playerInfo, target) {

    
            var location = JSON.parse(playerInfo.getLocation());
            var room = modules.room.room.playerLocation(location);


            modules.events.findObject.findObject(playerInfo, room, target, 'kill');
 

        },
        combatTimer: function(time) {
            return time || 1200;
        },
        combatRound: function (playerInfo, target, time, type) {
            return setInterval(function () {
          
                kill.startCombat(playerInfo, target, type);
             
            }, time);
        },

        initCombat: function (playerInfo, target) {
            //better way to do this?
            //combat speed will not be hard coded just testing
            // spells like slow and haste will need to change the speed also,
            kill.combatRound(playerInfo, target, 1200, "player");
            kill.combatRound(playerInfo, target, 2000, "mob");
        
        },
        startCombat: function (playerInfo, target, type) {
            //don't allow disconenct if fighting?
            //todo add HP loss
            //add actually hitting
            //add dieing
            if (type === "player") {
                let socket = playerInfo.getSocket();
                modules.helper.helpers.send(socket, "You stab a " + target.name);
            } else {
                let socket = playerInfo.getSocket();
                modules.helper.helpers.send(socket, target.name + " bites you");
            }
           
        }


    }
    exports.kill = kill;
})(require);