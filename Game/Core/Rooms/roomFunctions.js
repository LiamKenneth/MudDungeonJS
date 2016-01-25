(function (r) {
    "use strict";

    var modules = {
        helper: r('./../helpers'),
        data: r('./../data').data,
        playerSetup: {
            player: r('./../PlayerSetup/player-manager')
        },
        commands: r('./../commands'),
        loadPlayerLocation: r('./../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var room = {
        playerLocation: function(location) {

           // console.log(location)
            var region = location.region;
            var area = location.area;
            var areaId = location.areaID;

            return modules['world'][region][area][areaId];

        }
      

    };
    exports.room = room;
})(require);
