(function(r) {
  "use strict";

  var helpers = {
    cleanInput: function(string) {
      return string.toString().replace(/\W+/g, "");
    },
    capitalise: function(string) {
      return helpers.cleanInput(string).charAt(0).toUpperCase() + helpers.cleanInput(string).slice(1).toLowerCase();
    }
  };
exports.helpers = helpers;
})(require);
