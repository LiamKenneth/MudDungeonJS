'use strict';

describe('Player Setup: Race selection', function() {
  const should = require('should');

  const races = require('../../../../Game/Core/PlayerSetup/races').races;

  describe('show Race', function() {
    it('should show list of Races', function() {
      should.strictEqual(races.showRace(), 'Human Elf Dwarf Gnome Halfling ');
    });
  });

  describe('Select Race', function() {
    it('should select the Human race', function() {
      let selectedRace = races.chooseRace('human');

      should.strictEqual(selectedRace, 'Human');
    });

    it('should select the Elf race', function() {
      let selectedRace = races.chooseRace('elf');

      should.strictEqual(selectedRace, 'Elf');
    });

    it('should select the Dwarf race', function () {
        let selectedRace = races.chooseRace('dwarf');

        should.strictEqual(selectedRace, 'Dwarf');
    });

    it('should select the Gnome race', function () {
        let selectedRace = races.chooseRace('gnome');

        should.strictEqual(selectedRace, 'Gnome');
    });

    it('should select the Halfling race', function () {
        let selectedRace = races.chooseRace('halfling');

        should.strictEqual(selectedRace, 'Halfling');
    });

    it('should return false if not a race', function () {
        let selectedRace = races.chooseRace('dragon');

        should.strictEqual(selectedRace, false);
    });
  });
});
