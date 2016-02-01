(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
    };

    var help = function (socket, playerInfo, topic) {

        

        console.log("help on " +topic);

        var helpCommand = {
            "move": function () {
                var helpFile = modules.data.loadFile('./Game/Core/HelpFiles/', 'move');
                modules.helper.helpers.send(socket, helpFile);
            },
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