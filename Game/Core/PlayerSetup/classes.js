    "use strict";

    var modules = {
        helper: require('../helpers').helpers
    };
//8char max
    var classList = {
        fighter: 'Fighter',
        mage: 'Mage'
    };

    var classRoll = {
        fighter: 12,
        mage: 6,
        thief: 8,
        cleric: 8
    };

    exports.classes = {

        chooseClass: function(playerClass)
        {
            return classList[playerClass] || false;
        },

        showClass: function() {
            var index = Object.keys(classList);
            var displayClasses = "";

            for (var i = 0; i < index.length; i++) {
                displayClasses += modules.helper.capitalise(index[i]) + " ";
            }
            return displayClasses || false;
        }

    };
