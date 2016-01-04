(function(r) {
  "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers').helpers,
        commands: r('./commands').commands,
        fs: r('fs'),
        world:
        {
            valston: r('../World/valston/prison')
        }

    };

  var commands = {
    yes: function(string) {
      return string.toLowerCase().match(/^(y|yes|yea|yeah|sure|fine|okay|aye|yep|ok)$/)
    },
    no: function(string) {
      return string.toLowerCase().match(/^(n|no|never|nah|nay)$/)
    },
    look:function(string) {
      return string.toLowerCase().match(/^(l|look|loo)$/)
    },
    move: function(string) {

    },
    parseInput: function(pc) {
      var socket = pc.getSocket();

      socket.on('data', function(input)
      {

        var str = input.toString().toLowerCase();

        switch (true) {

          case /\bn(?!\w)|^(n(orth|ort|or|o)(?!\w))/i.test(str):
            console.log('North')
            break;
          case /\be(?!\w)|^(e(ast|as|a)(?!\w))/i.test(str):
            console.log('east')
            break;
          case /\bs(?!\w)|^(s(outh|out|ou|o)(?!\w))/i.test(str):
            console.log('south')
            break;
          case /\bw(?!\w)|^(w(est|es|e)(?!\w))/i.test(str):
            console.log('west')
            break;
          case /\bu(?!\w)|^(u(p)(?!\w))/i.test(str):
            console.log('up')
            break;
            case /\bd(?!\w)|^(d(own)(?!\w))/i.test(str):
            console.log('down')
            break;
          case /\bl(?!\w)|^(l(ook|o|oo)(?!\w))/i.test(str):
            console.log('look');
              var location = JSON.parse(pc.getLocation());
              //load room based on player location
              var region = location.region;
              console.log("reg " + region)
              var area = location.area;
              console.log("area " + area)
              var areaId = location.areaID;
              console.log("areaid " + areaId)
              var room = modules['world'][region][area][areaId];
              socket.emit('look', modules.events.look(socket, pc, room));
            break;
          case str.match(/^(i|in|inv|inve|inven|invent|invento|inventor|inventory)$/):
            console.log('inventory')
            break;
          default:
            console.log(str + " • Didn't match any test");
            break;
        }

      });

      // check if input is prefixed


      var move = {
        north: ''
      }
    }
  };
  exports.commands = commands;
})(require);
