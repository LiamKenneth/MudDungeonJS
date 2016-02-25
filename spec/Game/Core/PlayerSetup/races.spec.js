'use strict';

describe('Races', function() {
  const should = require('should');

  const races = require('../../../../Game/Core/PlayerSetup/races').races;

  describe('show Race', function() {
    it('should show list of Races', function() {
      should.strictEqual(races.showRace(), 'Human Elf Dwarf Gnome Halfling ');
    });
  });

  describe('Select Race', function() {
    it('should should select the Human class', function() {
      let selectedRace = races.chooseRace('human');

      should.strictEqual(selectedRace, 'Human');
    });

    it('should should select the Elf race', function() {
      let selectedRace = races.chooseRace('elf');

      should.strictEqual(selectedRace, 'Elf');
    });
  });
});
