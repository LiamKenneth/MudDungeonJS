'use strict';

describe('Core: data.js, Tests for loading and saving data', function() {
  let should = require('should'),
      sinon = require('sinon');

  let data = require('../../../Game/Core/data'),
        fs = require('fs');

  describe('loadFile', function() {
    before(function() {
      this.motd = fs.readFileSync('./Data/motd').toString('utf8');
    });

    it('loads the welcome ascii art', function() {
      let loadFile = sinon.spy(data, 'loadFile');

      should.strictEqual(loadFile('', 'motd'), this.motd);
    });

    it('loads the welcome ascii art from directory', function() {
      let motd = data.loadFile('./Data/', 'motd');

      should.strictEqual(motd, this.motd);
    });

    it('returns false when no file found', function() {
      let motd = data.loadFile('./I-just-don\'t', 'exist');

      should.strictEqual(motd, false);
    });
  });

  describe('savePlayer', function () {
    before(function () {
      this.testPlayer = require('../../Mock/testPlayer');
    });

    it('creates a new player file', function () {
      let savePlayer = sinon.spy(data, 'savePlayer');

      savePlayer(this.testPlayer, false);

      should.exist(this.testPlayer);
    });
  });
});
