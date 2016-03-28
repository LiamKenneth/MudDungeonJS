'use strict';

describe('Core: commands.js, Tests for commands', function() {
   const should = require('should');
   const   sinon = require('sinon');
   const playerClass = require('../../Game/Core/PlayerSetup/player').player;
  const playerJson = require('../Mock/testPlayer');
    let command = require('../../Game/Core/commands').commands;

    let player = new playerClass(playerJson);
    let socket = {
        write: sinon.spy(),
        once: sinon.spy(),
        on: sinon.stub()
    };
    player.setSocket(socket);

    it('should return a positive match for yes alternatives', function () {

        command.yes('y')[0].should.be.equal('y');
        command.yes('yes')[0].should.be.equal('yes');
        command.yes('yea')[0].should.be.equal('yea');
        command.yes('yeah')[0].should.be.equal('yeah');
        command.yes('sure')[0].should.be.equal('sure');
        command.yes('fine')[0].should.be.equal('fine');
        command.yes('okay')[0].should.be.equal('okay');
        command.yes('aye')[0].should.be.equal('aye');
        command.yes('yep')[0].should.be.equal('yep');
        command.yes('ok')[0].should.be.equal('ok');
    });

    it('should return a negative match for no alternatives', function () {

        command.no('N')[0].should.be.equal('n');
        command.no('NO')[0].should.be.equal('no');
        command.no('NEVER')[0].should.be.equal('never');
        command.no('NAH')[0].should.be.equal('nah');
        command.no('NAY')[0].should.be.equal('nay');

    });



});
