var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

  describe("Classes", function() {
    var modules = {
      playerSetup: {
          classes: require('./../../../Game/Core/PlayerSetup/classes').classes
    }
  };

  describe("showClasses", function() {
    it("should show list of classes", function() {

      var classes = modules.playerSetup.classes.showClass();

      expect(classes).to.equal('Fighter Mage ');
    });
});

describe("Select Class", function() {
  it("should should select the fighter class", function() {

    var selectedClass = modules.playerSetup.classes.chooseClass('fighter');

    expect(selectedClass).to.equal('Fighter');
  });
  it("should should select the Mage class", function() {

    var selectedClass = modules.playerSetup.classes.chooseClass('mage');

    expect(selectedClass).to.equal('Mage');
  });
});



});
