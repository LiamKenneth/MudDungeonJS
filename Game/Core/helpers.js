(function(r) {
  "use strict";

  var modules = {
    commands: r('./commands').commands
  };


  var helpers = {
    /**
     * functionComment - Cleans a string entered by the user
     *
     * @param  {string} string - The input from the user. eg: " !$@ lIaM"
     * @return {string}        - returns a string only containing characters [a-zA-Z] also strips white space.
     */
    cleanInput: function(string) {
      return string.toString().replace(/\W+/g, "");
    },
    /**
     * functionComment - capitalises a string entered by the user
     *
     * @param  {string} string - The input from the user. eg: lIaM
     * @return {string}        - returns a string starting with a capital. eg: Liam
     */
    capitalise: function(string) {
      return helpers.cleanInput(string).charAt(0).toUpperCase() + helpers.cleanInput(string).slice(1).toLowerCase();
    },
    /**
     * functionComment - Prompts the player with Yes or No and does an action based on the respo
     *                 - remember to Remove the event listner in your yes/no function param
     *
     * @param  {string} selected - The selected item to confirm, example: race, class, item to buy
     * @param  {function} yes - If a user says Y, the yes function runs
     * @param  {function} no - If a user says N, the no function runs
     * TODO:  Error Checking
     */
    promptPlayer: function(socket, selected, yes, no) {

        socket.write("You selected " + selected + " are you sure? [Y/N]\r\n");

              socket.on('data', function (input) {

                var input = helpers.cleanInput(input);

                      if (modules.commands.yes(input)) {
                        yes(selected);
                      }
                      else if (modules.commands.no(input)) {
                        no();
                      }
                      else {
                        socket.write("Plese answer with yes or no \r\n");
                      }
           });

         }
  };
exports.helpers = helpers;
})(require);
