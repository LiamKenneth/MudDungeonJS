(function(r) {
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers'),
        fs: r('fs'),
        world: {
            valston: r('../World/valston/prison')
        },
        events: {
            move: r('./Events/move'),
            look: r('./Events/look'),
            exam: r('./Events/examine'),
            say: r('./Events/say'),
            score: r('./Events/score'),
            help: r('./Events/help'),
            inventory: r('./Events/inventory'),
            get: r('./Events/get'),
            drop: r('./Events/drop')
        }
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

                var str = input.toString().toLowerCase().trim();
                //command  //preposition //item
                //Look    //at/on/in     //sign
                var command = str.split(' ').slice(0, 2).join(' ');

                var item = str.split(' ').slice(2).join(' ');

                if (item == null || item == '' || command.startsWith('say') || command.startsWith('help')) { //< This looks hacky
                    //at / in not used. eg: look sword
                    command = str.split(' ').slice(0, 1).join(' ');
                    item = str.split(' ').slice(1).join(' ');
                }

                console.log(command)
                console.log(item)

                var commandTable = {

                    n: function() {socket.removeAllListeners('data'); socket.emit('North', modules.events.move.move(pc, 'North', null));},
                    north: function() { commandTable.n(); },
                    e: function() {socket.removeAllListeners('data'); socket.emit('East',  modules.events.move.move(pc, 'East', null));},
                    east: function () { commandTable.e(); },
                    s: function() {socket.removeAllListeners('data');  socket.emit('South', modules.events.move.move(pc, 'South', null));},
                    south: function () { commandTable.s(); },
                    w: function() {socket.removeAllListeners('data'); socket.emit('West', modules.events.move.move(pc, 'West', null));},
                    west: function () { commandTable.w(); },
                    d: function() {socket.removeAllListeners('data'); socket.emit('Down', modules.events.move.move(pc, 'Down', null));},
                    down: function () { commandTable.d(); },
                    u: function() {socket.removeAllListeners('data'); socket.emit('Up', modules.events.move.move(pc, 'Up', null));},
                    up: function () { commandTable.u(); },
                    //Interaction
                    l: function() { socket.emit('Look', modules.events.look.look(socket, pc, null, item)); },
                    look: function() { commandTable.l(); },
                    "look at": function () { socket.emit('Look at', modules.events.look.look(socket, pc, 'at', item)); },
                    "l at": function() { socket.emit('Look at', modules.events.look.look(socket, pc, 'at', item)); },
                    'look in': function () { socket.emit('Look in', modules.events.look.look(socket, pc, 'in', item)); },
                    'l in': function() { socket.emit('Look in', modules.events.look.look(socket, pc, 'in', item)); },
                    ex: function () { commandTable.exam(); },
                    exam: function () { socket.emit('Examine Item', modules.events.exam.exam(socket, pc, item)); },
                    examine: function () { commandTable.exam(); },
                    help: function () { socket.emit('Help', modules.events.help.help(socket, pc, item)); },
                //    exits: function() {  console.log('look')  },
                    "'": function () { socket.emit('Say', modules.events.say.say(socket, pc, input)); },
                    say: function () { socket.emit('Say', modules.events.say.say(socket, pc, input)); },
                //    ">": function () { socket.emit('Say to', modules.events.events.say(socket, pc, input)) },
                    score: function() { socket.emit('Score', modules.events.score.score(socket, pc)); },
                    i: function () { socket.emit('inventory', modules.events.inventory.inventory(socket, pc)); },
                    inv: function () { commandTable.i() },
                    inventory: function () { commandTable.i() },
                    get: function () { socket.emit('Get Item', modules.events.get.get(socket, pc, item)) },
                    drop: function () { socket.emit('Drop Item', modules.events.drop.drop(socket, pc, item)) }
                }

                function processUserInput(command) {
                    if (commandTable.hasOwnProperty(command))
                    {
                        commandTable[command]();
                    }
                     else
                    {
 
                      modules.helper.helpers.send(socket, "Sorry " + command + " is not recognised command");

                    }
                }

                processUserInput(command);


            });

        }
    };
    exports.commands = commands;
})(require);
