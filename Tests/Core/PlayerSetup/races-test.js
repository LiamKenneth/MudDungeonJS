var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

  describe("Races", function() {
    var modules = {
      playerSetup: {
          races: require('./../../../Game/Core/PlayerSetup/races').races
    }
  };

  describe("show Race", function() {
    it("should show list of Races", function() {

      var races = modules.playerSetup.races.showRace();

      expect(races).to.equal('Human Elf Dwarf Gnome Halfling ');
    });
});

describe("Select Race", function() {
  it("should should select the Human class", function() {

    var selectedRace = modules.playerSetup.races.chooseRace('human');

    expect(selectedRace).to.equal('Human');
  });
  it("should should select the Elf race", function() {

    var selectedRace = modules.playerSetup.races.chooseRace('elf');

    expect(selectedRace).to.equal('Elf');
  });
});



});
