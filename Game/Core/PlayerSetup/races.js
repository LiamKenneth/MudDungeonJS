    "use strict";

    var modules = {
        helper: require('../helpers').helpers
    };

    var raceList = {
        human: 'Human',
        elf: 'Elf',
        dwarf: 'Dwarf',
        gnome: 'Gnome',
        halfling: 'Halfling'
    }

    exports.races = {

        chooseRace: function(playerRace) {
          console.log(playerRace)
            return raceList[playerRace] || false;
        },

        showRace: function() {
            var index = Object.keys(raceList);
            var displayRaces = "";

            for (var i = 0; i < index.length; i++) {
                displayRaces += modules.helper.capitalise(index[i]) + " ";
            }
            return displayRaces || false;
        }
    };
