(function (r) {
    "use strict";
    var events = r('events');
    var eventEmitter = new events.EventEmitter();

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
            if (tickCount <= 35) {

                switch (true) {
                    case (tickCount <= 7):
                        console.log("Night");
                        break;
                    case (tickCount <= 9):
                        console.log("Twilight");
                        break;
                    case (tickCount <= 11):
                        // Emit event "Sunrise";
                        console.log("Sunrise");
                        break;
                    case (tickCount <= 23):
                        // Emit event "Morning";
                        console.log("Morning");
                        break;
                    case (tickCount === 24):
                        // Emit event "Midday";
                        console.log("Midday");
                        break;
                    default:
                        // Emit event "Afternoon";
                        console.log("Afternoon");
                }

            } else {
                switch (true) {
                    case (tickCount <= 36):
                        // Emit event "Sunset";
                        console.log("Sunset");
                        break;
                    case (tickCount <= 40):
                        // Emit event "MoonRise";
                        console.log("MoonRise");
                        break;
                    case (tickCount < 48):
                        // Emit event "Night";
                        console.log("Night");
                        break;
                    case (tickCount === 48):
                        // Emit event "MidNight";
                        console.log("MidNight");
                        break;
                    default:
                        // Emit event "Twilight";
                        console.log("MidNight");
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
        }
         
        eventEmitter.on('updateTime', updateTime);
        eventEmitter.on('tickTImerStart', recursive);
        eventEmitter.emit('tickTImerStart');

    }
    exports.time = time;
})(require);