'use strict';

describe('Player Setup: Rolling Stats', function () {
  const should = require('should');

  const stats = require('../../../../Game/Core/PlayerSetup/stats').stats;

  describe('Roll Dice generates a random number 1-6 three times and add 6 to the total.', function () {

    it('Stat roll should be atleast 9 or higher', function() {
        (stats.rollStats()).should.be.aboveOrEqual(9);
    });

    it('Stat roll should not be higher than 24', function () {
        (stats.rollStats()).should.be.belowOrEqual(24);
    });

  });

  describe('Player stats generates stats for player attributes', function () {
      var stat = stats.playerStats();

      it('Player stats should contain 6 player attributes', function () {
          Object.keys(stat).length.should.be.equal(6);
      });

      it('Should generate stats for player strength', function () {      
          stat.str.should.be.aboveOrEqual(9);
      });

      it('Should generate stats for player dexterity', function () {
          stat.dex.should.be.aboveOrEqual(9);
      });

      it('Should generate stats for player constitution', function () {
          stat.con.should.be.aboveOrEqual(9);
      });

      it('Should generate stats for player intelligence', function () {
          stat.int.should.be.aboveOrEqual(9);
      });

      it('Should generate stats for player wisdom', function () {
          stat.wis.should.be.aboveOrEqual(9);
      });

      it('Should generate stats for player charisma', function () {
          stat.cha.should.be.aboveOrEqual(9);
      });

  });
 
});
