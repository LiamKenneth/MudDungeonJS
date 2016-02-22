(function (r) {
    "use strict";
    var events = r('events');
    var eventEmitter = new events.EventEmitter();

    var time = function () {

        var settings = {
            tickCount: 0,
            tickDuration: 45000,
            ticksInDay: 120,
            autoSaveTick: 300000,
            sunrise: 13,
            morning: 26,
            midDay: 39,
            afternoon: 52,
            sunset: 65,
            moonRise: 78,
            night: 91,
            midNight: 104,
            twilight: 117,
            hour: 0,
            minute: 0
        };

        var recursive = function () {
            console.log("tick " + settings.tickCount);
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


            if (settings.hour.length === 1) {
                settings.hour = 0 + settings.hour
            }
            var hour = settings.hour;
            var minute = settings.minute;

            //increment tick
            settings.tickCount += 1;

            if (settings.tickCount === 120) {
                settings.tickCount = 0;
            }

           function addZero(time) {
               if (time.toString().length === 1) {
                   return "0" + time;
               }

               return time;
           }

            console.log("time " + addZero(hour) + ":" + addZero(minute));

            //message for day/night
            if (tickCount <= 52) {

                switch (true) {
                    case (tickCount <= 13):
                        // Emit event "Sunrise";
                        console.log("Sunrise");
                        break;
                    case (tickCount <= 26):
                        // Emit event "Morning";
                        console.log("Morning");
                        break;
                    case (tickCount <= 39):
                        // Emit event "Midday";
                        console.log("Midday");
                        break;
                    default:
                        // Emit event "Afternoon";
                        console.log("Afternoon");
                }

            } else {
                switch (true) {
                    case (tickCount <= 65):
                        // Emit event "Sunset";
                        console.log("Sunset");
                        break;
                    case (tickCount <= 78):
                        // Emit event "MoonRise";
                        console.log("MoonRise");
                        break;
                    case (tickCount <= 91):
                        // Emit event "Night";
                        console.log("Night");
                        break;
                    case (tickCount <= 104):
                        // Emit event "MidNight";
                        console.log("MidNight");
                        break;
                    default:
                        // Emit event "Twilight";
                        console.log("Twilight");
                }
            }


            if (tickCount === ticksInDay) {
                //New day reset
                settings.tickCount = 0;
            }


            //get from JSON?
            var date = {
                day: 1,
                month: 0,
                year: 0,
                name: "Year of the Void" // how will this change?
            }

            //change Day
            date.day += 1;

            //Change Month
            if (date.day === 32) {
                date.month += 1;
            }

            //Change year
            if (date.month === 13) {
                date.month = 1;
                date.year += 1;
            }

            var getMonth = function (monthNum) {
                var monthArray = [
                    "January", 'February', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'
                ];

                return monthArray[monthNum];
            };


            var year = date.day + " " + getMonth(date.month) + " " + date.year + " : " + date.name;

           // console.log(year);

            /*
             * Every 45 Seconds update player health, mana, moves
             * Update game clock, weather, other effects,
             * trigger npc scripts?
             * when to reset rooms?
             * when to save world
             */
            setTimeout(recursive, 1000);
        }

        eventEmitter.on('tickTImerStart', recursive);
        eventEmitter.emit('tickTImerStart');

    }
    exports.time = time;
})(require);