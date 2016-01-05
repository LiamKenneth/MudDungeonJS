var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

  describe("Player Manager", function() {
    var modules = {
          telnet: require('wez-telnet'),
      playerSetup: {
          player: require('./../../../Game/Core/PlayerSetup/player-manager').playerManager,
          playerChar: require('./../../../Game/Core/PlayerSetup/player').player,
    }
  };




  describe("load player", function() {
    it("should load player JSON", function() {

      var playerData = JSON.parse(modules.data.loadFile(null, 'pug.json'));
       var PC = new modules.playerSetup.playerChar(playerData);
      modules.playerSetup.player.loadPlayer(PC);
      // if (playerData) {
      //
      //     PC.setSocket(socket);
      //     modules.playerSetup.player.addPlayer(PC.getSocket());
      //
      //   }
      //
      // var races = modules.playerSetup.races.showRace();
      //
      // expect(races).to.equal('Human Elf Dwarf Gnome Halfling ');
    });
});





});
