var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

  describe("Data", function() {
    var modules = {
      data: require('./../../Game/Core/data.js').data,
      fs: require('fs')
    };

  describe("loadMOTD", function() {
    it("should load the Welcome Ascii art", function() {

      var motd = modules.data.loadMotd('motd');
      expect(motd).should.exist;
    });
});
});
