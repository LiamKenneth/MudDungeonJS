(function(r) {
  "use strict";

  var modules = {
    helper: r('./helpers').helpers,
    commands: r('./commands').commands
  };

  var events = {
    look: function(player) {

modules.helper.send(socket, "You look around");

    }

  };
  exports.events = events;
})(require);
