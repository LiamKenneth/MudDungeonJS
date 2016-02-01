(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers')
    };

    var help = function (socket, playerInfo, topic) {

        

        console.log("help on " +topic);

        var helpCommand = {
            "move": function () { modules.helper.helpers.send(socket, "You can move by typing a direction like North or n for short. This works for all cardinal directions....") },
            "movement": function () { helpCommand.move() },
            "move up": function () { modules.helper.helpers.send(socket, "It works") }
        };


        function processUserInput(command) {
            if (helpCommand.hasOwnProperty(command)) {
                helpCommand[command]();
            }
            else {

                modules.helper.helpers.send(socket, "Sorry can't find help for: " + topic);

            }
        }

        processUserInput(topic);

        

       
    }
    exports.help = help;
})(require);