(function(r) {
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers'),
        fs: r('fs'),
        world: {
            valston: r('../World/valston/prison')
        },
  events: r('./events.js')
    };

    var commands = {
        yes: function(string) {
            return string.toLowerCase().match(/^(y|yes|yea|yeah|sure|fine|okay|aye|yep|ok)$/)
        },
        no: function(string) {
            return string.toLowerCase().match(/^(n|no|never|nah|nay)$/)
        },
        parseInput: function(pc) {

            var socket = pc.getSocket();

            socket.on('data', function(input) {

                var command = input.toString().toLowerCase().trim();

                var commandTable = {

                    n: function() {socket.removeAllListeners('data'); modules.events.events.move(pc, 'North', null)},
                    north: function() {modules.events.events.move(pc, 'North', null)},
                    e: function() {console.log('East')},
                    east: function() {  console.log('East')},
                    s: function() {socket.removeAllListeners('data');  modules.events.events.move(pc, 'South', null)},
                    south: function() {modules.events.events.move(pc, 'South', null) },
                    w: function() {console.log('West')},
                    west: function() {console.log('West')  },
                    d: function() {console.log('down')  },
                    down: function() {  console.log('down')},
                    u: function() {  console.log('up')},
                    up: function() {  console.log('up')  },
                    //Interaction
                    l: function() {  console.log('look')  },
                    look: function() {  console.log('look')  },
                    ex: function() {  console.log('Exam Item') },
                    exam: function() {  console.log('Exam Item') },
                    exits: function() {  console.log('look')  },
                    "'": function() {  console.log('Say')  },
                    say: function() {  console.log('Say')  },
                    score: function() {  console.log('Score')  },
                    i: function() {  console.log('Inventory')  },
                    inv: function() {  console.log('Inventory')  },
                }

                function processUserInput(command) {
                    if (commandTable.hasOwnProperty(command))
                    {
                        commandTable[command]();
                    }
                     else
                    {
                        try
                        {
                            modules.helper.helpers.send(socket, "Sorry " + command + " is not recognised command");
                        }
                        catch (e)
                        {
                            console.log(e)
                        }
                    }
                }

                processUserInput(command);


            });

            // check if input is prefixed


            var move = {
                north: ''
            }
        }
    };
    exports.commands = commands;
})(require);
