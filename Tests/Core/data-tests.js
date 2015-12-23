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

      var motd = modules.data.loadFile(null, 'motd');
      expect(motd).should.exist;
    });
});

describe("savePlayer", function() {
  it("Should save the player in JSON, using thier name", function() {

     var player = {name: "test" }

    modules.data.savePlayer(player);

   var playerFile =  modules.fs.readFileSync('Data/test.json').toString('utf8');

    expect(playerFile).should.exist;

  });

});
});
