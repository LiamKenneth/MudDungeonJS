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
     * functionComment - Prompts the player with Yes or No and does an action based on the response
     *                 - remember to Remove the event listner in your yes/no function param
     *
     * @param  {string} selected - The selected item to confirm, example: race, class, item to buy
     * @param  {function} yes - If a user says Y, the yes function runs
     * @param  {function} no - If a user says N, the no function runs
     * TODO:  Error Checking
     */
    promptPlayer: function(socket, selected, yes, no) {

      socket.write("You selected " + selected.trim() + " are you sure? [Y/N]\r\n");
      socket.emit('data', { data: "You selected " + selected.trim() + " are you sure? [Y/N]\r\n" });
      socket.on('data', function(input) {

        var input = helpers.cleanInput(input);

        if (modules.commands.yes(input)) {
          yes(selected);
        } else if (modules.commands.no(input)) {
          no();
        } else {
          socket.write("Please answer with yes or no \r\n");
          socket.emit('data', { data: "Plese answer with yes or no \r\n" });
        }
      });

    },
    /**
     * functionComment - Simulates a dice throw
     *
     * @param  {int} number - The number of dice to throw
     * @return {int} size   - The size of the dices
     * @example if you want to roll 2d6, just call dice(2,6)
     */
    dice: function(number, size) {
      var sum = 0;
      for(var i = number; i--;) {
          sum += Math.floor((Math.random() * size) + 1);
      }

      return sum;
    },
      /**
       * functionComment - Sends text to the client telnet or browser (socket.io)
       * @param  {string} text - The message to send to the client
       * @example helpers.send(socket, 'hello');
       */
      send: function(socket, text) {

          //A hack, not sure what nsp is. socket.io returns it though
          if(!socket.nsp) {
              socket.write(text + '\r\n\r\n');
          }
          else {
              socket.emit('data', { data: text });
          }

      }
  };
  exports.helpers = helpers;
})(require);
