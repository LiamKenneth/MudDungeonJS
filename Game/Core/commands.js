(function(r) {
  "use strict";

  var modules = {
    helper: r('./helpers').helpers
  };

  var commands = {
    yes: function(string) {
      return modules.helper.cleanInput(string).toLowerCase().match(/^(y|yes|yea|yeah|sure|fine|okay|aye|yep|ok)$/)
    },
    no: function(string) {
      return modules.helper.cleanInput(string).toLowerCase().match(/^(n|no|never|nah|nay)$/)
    }
  };
exports.commands = commands;
})(require);
