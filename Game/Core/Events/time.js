(function (r) {
    "use strict";
    var events = r('events');
    var eventEmitter = new events.EventEmitter();
    var playerManager = r('../PlayerSetup/player-manager').playerManager;
    var helper = r('../helpers');
    var world = {
        valston: r('../../World/valston/prison')
    };

    var time = function () {

        var settings = {
            tickCount: 0,
            tickDuration: 45000,
            ticksInDay: 48,
            autoSaveTick: 300000,
            sunrise: 11,
            morning: 14,
            midDay: 24,
            afternoon: 30,
            sunset: 36,
            moonRise: 40,
            night: 42,
            midNight: 48,
            twilight: 8,
            hour: 0,
            minute: 0
        };

        var recursive = function () {

            eventEmitter.emit('updateTime');
            eventEmitter.emit('updatePlayer', "hitpoints", "maxHitpoints", "constitution");
            eventEmitter.emit('updatePlayer', "mana", "maxMana", "intelligence");
            eventEmitter.emit('updatePlayer', "moves", "maxMoves", "dexterity");
            eventEmitter.emit('updateRoom');
            eventEmitter.emit('showPromptOnTick');

           // console.log(year);

            /*
             * Every 45 Seconds update player health, mana, moves
             * Update game clock, weather, other effects,
             * trigger npc scripts?
             * when to reset rooms?
             * when to save world
             */
            setTimeout(recursive, 5000);
        }

        /* Shows player prompt */
        function showPromptOnTick() {
            var player = playerManager.getPlayers;

            playerManager.each(function (player) {

                var socket = player.getSocket();
                var playerPrompt = player.getPrompt(true);

                helper.helpers.send(socket, playerPrompt);
            });

          
        };

        /*Update Time, Day/night cycles*/
        function updateTime() {
        
            var tickCount = settings.tickCount;
            var ticksInDay = settings.ticksInDay;

            if (tickCount !== 0) {

                if (settings.minute === 30) {
                    settings.hour += 1;

                    if (settings.hour === 24) {
                        settings.hour = 0;
                    }
                }

                settings.minute += 30;

                if (settings.minute === 60) {
                    settings.minute = 0;
                }

            }


            var hour = settings.hour;
            var minute = settings.minute;

            //increment tick
            settings.tickCount += 1;

            if (settings.tickCount === 48) {
                settings.tickCount = 0;
            }

            function addZero(time) {
                if (time.toString().length === 1) {
                    return "0" + time;
                }

                return time;
            }

            console.log("time " + addZero(hour) + ":" + addZero(minute));

            //Shows message for day/night
            //TODO: code for moon phases?
            if (tickCount <= 35) {

                switch (true) {
                    case (tickCount == 3):
                        // Emit event "night";
                        playerManager.broadcast("The moon is slowly moving west across the sky.");
                        break;
                    case (tickCount == 9):
                        // Emit event "Twilight";
                        playerManager.broadcast("The moon slowly sets in the west.");
                        break;
                    case (tickCount == 11):
                        // Emit event "Sunrise";
                        playerManager.broadcast("The sun slowly rises from the east.");
                        break;
                    case (tickCount == 13):
                        // Emit event "Morning";
                        playerManager.broadcast("The sun has risen from the east, the day has begun.");
                        break;
                    case (tickCount === 24):
                        // Emit event "Midday";
                        playerManager.broadcast("The sun is high in the sky.");
                        break;
                    case (tickCount === 29):
                        // Emit event "Afternoon";
                        playerManager.broadcast("The sun is slowly moving west across the sky.");
                }

            } else {
                switch (true) {
                    case (tickCount == 36):
                        // Emit event "Sunset";
                        playerManager.broadcast("The sun slowly sets in the west.");
                        break;
                    case (tickCount == 40):
                        // Emit event "MoonRise";
                        playerManager.broadcast("The moon slowly rises in the west.");
                        break;
                    case (tickCount == 43):
                        // Emit event "Night";
                        playerManager.broadcast("The moon has risen from the east, the night has begun.");
                        break;
                    case (tickCount === 48):
                        // Emit event "MidNight";
                        playerManager.broadcast("The moon is high in the sky.");
                        break;
                  
                }
            }


            if (tickCount === ticksInDay) {
                //New day reset
                settings.tickCount = 0; 
            }

            //TODO: Date update, 

        }

        /**
        Update player and mob HP,Mana,Moves.
        @param {string} stat The stat to update
        @param {string} maxStat The maxStat of stat to update
        @param {string} statType The primary ability linked to stat
        */  
        function updatePlayer(stat, maxStat, statType) {
            console.log(stat + " " + maxStat + " " + statType);

            console.time("updatePlayer");
            var player = playerManager.getPlayers;

            playerManager.each(function (player) {

                var playerInfo = player.getPlayerInfo();
                
                //Update Hitpoints if player/mob is hurt
                if (playerInfo.information[stat] !== playerInfo.information[maxStat]) {

                    var gain = playerInfo.information[stat] += playerInfo.information.stats[statType];

                    if (gain > playerInfo.information[maxStat]) {
                        gain = playerInfo.information[maxStat];
                    }

                    playerInfo.information[stat] = gain;
                }

            });

            console.timeEnd("updatePlayer");
        }

        /*
         * Create function to update rooms / heal mobs
         * --------------------------------------------
         * When player interacts with the room. (Get item, Attack mob)
         * Set room clean status to false.
         * This will add the room to an array.
         * The update function will loop through this array and only update the dirty rooms.
         * The array will check for missing items and add them back if there is no player in the room.
         * It will also check / update mob health
         * If there is a corpse it should be removed
         * have a delay for when to do the update? Update if it's been 5 minutes? this should stop looping through a large amount of
         * rooms. set a timestamp when we set dirty? then check the difference in the update?  if the timestamp >= the update time. update the room
         * Have a flag for when room items are clean?
         * Have flag for when mobs are clean this will stop unnecessary looping through room items so we only update mob status
         * once all clean, remove from modified room array
         * That should cover it!!
         */


        var room = [
                world.valston.prison
            
        ];

        var roomLength = room.length;
         

        function updateRoom() {
            console.time("updateRoom");
            /* Searches all areas */
            for (var i = 0; i < roomLength; i++) {
               
                var area = room[i];

                for (var key in area) {
                    var defaultItems = area[key].defaults.items;
                    var defaultItemCount = defaultItems.length;

                    for (var j = 0; j < defaultItemCount; j++) {
                 
                        if (area[key].items.indexOf(defaultItems[j]) == -1) {
                            area[key].items.push(defaultItems[j]);
                        }
                        
                    }

                }
                 
            }

            console.timeEnd("updateRoom");
        }

        eventEmitter.on('updateTime', updateTime);
        eventEmitter.on('updatePlayer', updatePlayer);
        eventEmitter.on('showPromptOnTick', showPromptOnTick);
        eventEmitter.on('updateRoom', updateRoom);
        eventEmitter.on('tickTImerStart', recursive);
        eventEmitter.emit('tickTImerStart');

    }
    exports.time = time;
})(require);