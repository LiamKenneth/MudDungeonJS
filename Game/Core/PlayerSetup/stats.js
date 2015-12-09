"use strict";

var modules = {
    helper: require('../helpers').helpers
};

exports.stats = {
/**
 * functionComment - Rolls stats for player abilities using the rule 4d6 -lowest
 *
 * @returns The sum of 3 dice rolls
 * @example Just call rollStats() will return a sum of the dices
 */
    rollStats: function() {

        var roll = [];
  			var totalRoll = 0;

        for(var i = 4; i--;) {
          roll.push(modules.helper.dice(1, 6))
        }

  			var lowestValue = Math.min.apply(null, roll);
        var lowestValueIndex = roll.indexOf(lowestValue);

        roll.splice(lowestValueIndex, 1);

        for(var i = roll.length; i--;) {
          totalRoll += roll[i];
        }

        return totalRoll
    },
    /**
     * functionComment - Sets stat for each player ability
     *
     * @returns an object containing random stats for each player ability
     * @example Just call playerStats() will return an object with random stats
     */
    playerStats: function() {

      var stats = {
        str: exports.stats.rollStats(),
        dex: exports.stats.rollStats(),
        con: exports.stats.rollStats(),
        int: exports.stats.rollStats(),
        wis: exports.stats.rollStats(),
        cha: exports.stats.rollStats()
      }

      return stats;
    }
};
