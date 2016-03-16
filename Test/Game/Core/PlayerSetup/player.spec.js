'use strict';

describe('Player Setup: Player Class', function () {
  const should = require('should');

  const playerClass = require('../../../../Game/Core/PlayerSetup/player').player;

  const playerJson = require('../../../Mock/testPlayer');

  describe('Player stores and retreives information about the player', function () {

      let player = new playerClass(playerJson);

    it('Should return players name', function() {
        let playerName = player.getName();

        playerName.should.be.equal('testPlayer');
    });

    it('Should return players age', function () {
        let playerAge = player.getAge();

        playerAge.should.be.equal(18);
    });

    it('Should return players level', function () {
        let playerLevel= player.getLevel();

        playerLevel.should.be.equal(1);
    });

    it('Should return players class', function () {
        let playerClass = player.getClass();

        playerClass.should.be.equal('Mage');
    });

    it('Should return players race', function () {
        let playerRace = player.getRace();

        playerRace.should.be.equal('Elf');
    });

    it('Should return players description', function () {
        let playerDesc = player.getDescription();

        playerDesc.should.be.equal('You see nothing special about them');
    });

    it('Should return players equipment', function () {
        let playerEq = player.getEquipment();

        playerEq.floating.should.be.equal('Nothing');
        playerEq.light.should.be.equal('Nothing');
        playerEq.head.should.be.equal('Nothing');
        playerEq.leftEar.should.be.equal('Nothing');
        playerEq.rightEar.should.be.equal('Nothing');
        playerEq.neck.should.be.equal('Nothing');
        playerEq.cloak.should.be.equal('Nothing');
        playerEq.aboutBody.should.be.equal('Nothing');
        playerEq.body.should.be.equal('Nothing');
        playerEq.waist.should.be.equal('Nothing');
        playerEq.leftSheath.should.be.equal('Nothing');
        playerEq.rightSheath.should.be.equal('Nothing');
        playerEq.back.should.be.equal('Nothing');
        playerEq.leftWrist.should.be.equal('Nothing');
        playerEq.rightWrist.should.be.equal('Nothing');
        playerEq.leftHand.should.be.equal('Nothing');
        playerEq.rightHand.should.be.equal('Nothing');
        playerEq.leftRing.should.be.equal('Nothing');
        playerEq.rightRing.should.be.equal('Nothing');
        playerEq.legs.should.be.equal('Nothing');
        playerEq.feet.should.be.equal('Nothing');
    });

    it('Should return 21 equipment slots', function () {
        let playerEq = player.getEquipment();

        Object.keys(playerEq).length.should.be.equal(21);
    });

    it('Should return players location', function () {
        let playerLoc = JSON.parse(player.getLocation());

        playerLoc.region.should.be.equal('valston');
        playerLoc.area.should.be.equal('prison');
        playerLoc.areaID.should.be.equal(0);
        playerLoc.coordsY.should.be.equal(0);
        playerLoc.coordsX.should.be.equal(0);

    });

    it('Should return 5 properties of location', function () {
        let playerLoc = JSON.parse(player.getLocation());

        Object.keys(playerLoc).length.should.be.equal(5);

    });

    it('Should return players information Object', function () {
  
        let playerInfo = player.getInformation();
 
        playerInfo.level.should.be.equal(1);
        playerInfo.race.should.be.equal('Elf');
        playerInfo.class.should.be.equal('Mage');
        

        //this.information = {
        //    level: playerInfo.information.level || 1,
        //    race: playerInfo.information.race || '',
        //    class: playerInfo.information.class || '',
        //    alignment: playerInfo.information.alignment || 'Good',
        //    alignmentScore: playerInfo.information.alignmentScore || 0,
        //    experience: playerInfo.information.experience || 0,
        //    experienceToNextLevel: playerInfo.information.experienceToNextLevel || 0,
        //    maxHitpoints: playerInfo.information.maxHitpoints || 32,
        //    hitpoints: playerInfo.information.hitpoints || 32,
        //    maxMana: playerInfo.information.maxMana || 100,
        //    mana: playerInfo.information.mana || 100,
        //    maxMoves: playerInfo.information.maxMoves || 100,
        //    moves: playerInfo.information.moves || 100,
        //    stats: {
        //        strength: playerInfo.information.stats.strength || 0,
        //        dexterity: playerInfo.information.stats.dexterity || 0,
        //        constitution: playerInfo.information.stats.constitution || 0,
        //        intelligence: playerInfo.information.stats.intelligence || 0,
        //        wisdom: playerInfo.information.stats.wisdom || 0,
        //        charisma: playerInfo.information.stats.charisma || 0
        //    }


    });

  });
 
 
});
