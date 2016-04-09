(function (r) {
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
        cleanInput: function (string) {
            return string.toString().replace(/\W+/g, "");
        },
        /**
         * functionComment - capitalises a string entered by the user
         *
         * @param  {string} string - The input from the user. eg: lIaM
         * @return {string}        - returns a string starting with a capital. eg: Liam
         */
        capitalise: function (string) {
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
        promptPlayer: function (socket, selected, yes, no) {

            socket.write("You selected " + selected.trim() + " are you sure? [Y/N]\r\n");
            socket.emit('data', { data: "You selected " + selected.trim() + " are you sure? [Y/N]\r\n" });
            socket.on('data', function (input) {

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
        dice: function (number, size) {
            var sum = 0;
            for (var i = number; i--;) {
                sum += Math.floor((Math.random() * size) + 1);
            }

            return sum;
        },

        /**
        * functionComment - Colors text.  Based upon Lope's colour snippet for ROM based muds.
        * Escape character for colour: {
        * Examples: 
        * {rThis statement will display red.
        * {bThis statement will display blue.
        * {gThis statement will appear green with the last word being {yyellow.
        * If using colour in a reference name such as an object (dagger), always end with a default colour code to prevent further bleeding.
        * getColourCode - helper function to return colour code
        *
        * $$$ - Todo additions -
        *  Allow for escape codes to use actual { in conversation or examples such as \{ or {{.  Can't really have a help file or instruction until this is resolved.
        **/
        colourify: function (text, socket) {
            if (text == null)
                return '';

            var found = false;

            // Capture all instances of escape character
            while (text.indexOf('{') != -1) {
                found = true;
                var characterNum = text.indexOf('{') + 1;
                var char = text.charAt(characterNum);

                text = text.replace('{' + char, helpers.getColourCode(char, socket));

                // HTML termination
                if (socket.nsp) {
                    // If we have another one, terminate the <span> before it begins
                    if (text.indexOf('{') != -1) {
                        text = text.replace('{', '</span>{');
                    }
                }
            }

            // Remove bleeding 
            if (found && !socket.nsp) // terminal
                text = text + helpers.getColourCode('x', socket);
            if (found && socket.nsp) // html
                text = text + '</span>';

            return text;
        },

        getColourCode: function (code, socket) {
            // ANSI colours
            if (!socket.nsp) {
                switch (code) {
                    case 'r': return '\x1b[0;31m';  // red
                    case 'g': return '\x1b[0;32m';  // green
                    case 'y': return '\x1b[0;33m';  // yellow
                    case 'b': return '\x1b[0;34m';  // blue
                    case 'm': return '\x1b[0;35m';  // magenta
                    case 'c': return '\x1b[0;36m';  // cyan
                    case 'w': return '\x1b[0;37m';  // white / grey
                    case 'D': return '\x1b[1;30m';  // dark grey
                    case 'R': return '\x1b[1;31m';  // bright red
                    case 'G': return '\x1b[1;32m';  // bright green
                    case 'Y': return '\x1b[1;33m';  // bright yellow
                    case 'B': return '\x1b[1;34m';  // bright blue
                    case 'M': return '\x1b[1;35m';  // bright magenta
                    case 'C': return '\x1b[1;36m';  // bright cyan
                    case 'W': return '\x1b[1;37m';  // bright white / grey
                    case 'x': default: return '\x1b[0m';      // default colour
                }
            }
            else { // HTML colours
                var insertText = '<span style="color: ';
                var codeText;

                switch (code) {
                    case 'r': codeText = 'darkred'; break;    // red
                    case 'g': codeText = 'darkgreen'; break;  // green
                    case 'y': codeText = 'darkyellow'; break; // yellow
                    case 'b': codeText = 'darkblue'; break;   // blue
                    case 'm': codeText = 'darkmagenta'; break;// magenta
                    case 'c': codeText = 'darkcyan'; break;   // cyan
                    case 'w': codeText = 'whitesmoke'; break; // white / grey
                    case 'D': codeText = 'grey'; break;       // dark grey
                    case 'R': codeText = 'red'; break;        // bright red
                    case 'G': codeText = 'green'; break;      // bright green
                    case 'Y': codeText = 'yellow'; break;     // bright yellow
                    case 'B': codeText = 'blue'; break;       // bright blue
                    case 'M': codeText = 'magenta'; break;    // bright magenta
                    case 'C': codeText = 'cyan'; break;       // bright cyan
                    case 'W': codeText = 'white'; break;      // bright white / grey
                    case 'x': default: codeText = 'inherit'; break;     // default colour
                }

                // <span style="color: COLORNAME">
                return insertText + codeText + '">';
            }
        },

        /**
         * functionComment - Sends text to the client telnet or browser (socket.io)
         * @param  {string} text - The message to send to the client
         * @example helpers.send(socket, 'hello');
         */
        send: function (socket, text) {

            
            try {


            if (typeof socket !== 'undefined') {

                    text = helpers.colourify(text, socket);

                    //A hack, not sure what nsp is. socket.io returns it though
                    if (!socket.nsp) {
                        socket.write(text + '\r\n\r\n');
                    } else {
                        socket.emit('data', { data: text });

                    }
               
            }
            } catch (e) {
                console.log(e);
            }
        }
    };
    exports.helpers = helpers;
})(require);
