var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

  describe("Classes", function() {
    var modules = {
      playerSetup: {
          classes: require('./../../Game/Core/PlayerSetup/classes').classes
    }
  };

  describe("showClasses", function() {
    it("should show list of classes", function() {

      var classes = modules.playerSetup.classes.chooseClass();
      expect(classes).to.equal('Fighter Mage');
    });
});



});
