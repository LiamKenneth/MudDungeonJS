(function (r) {
    "use strict";
    var events = r('events');
    var eventEmitter = new events.EventEmitter();
    var playerManager = r('../PlayerSetup/player-manager').playerManager;

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
            eventEmitter.emit('updatePlayer');

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

        /*
         * Update player and mob HP,Mana,Moves
         */
        function updatePlayer() {
            var player = playerManager.getPlayers;

            playerManager.each(function (player) {

                var playerInfo = player.getPlayerInfo();
                
                //Update Hitpoints if player/mob is hurt
                //TODO make this a function to reuse for HP, mana and moves
                if (playerInfo.information.hitpoints != playerInfo.information.maxHitpoints) {

                    var gain = playerInfo.information.hitpoints += playerInfo.information.stats.constitution;

                    if (gain > playerInfo.information.maxHitpoints) {
                        gain = playerInfo.information.maxHitpoints;
                    }

                    playerInfo.information.hitpoints = gain;
                }

            });
        }
         
        eventEmitter.on('updateTime', updateTime);
        eventEmitter.on('updatePlayer', updatePlayer);
        eventEmitter.on('tickTImerStart', recursive);
        eventEmitter.emit('tickTImerStart');

    }
    exports.time = time;
})(require);