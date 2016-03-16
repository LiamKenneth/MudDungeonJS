'use strict';

describe('Player Setup: Player Class', function () {
  const should = require('should');

  const playerClass = require('../../../../Game/Core/PlayerSetup/player').player;

  const playerJson = require('../../../Mock/testPlayer');

  describe('Player stores and retreives information about the player', function () {

      let player = new playerClass(playerJson);

      describe('Should return player Object', function () {

          //Some properites omitted as they are covered in other tests

          let playerObj = player.getPlayerInfo();

          it('Should return player Object', function () {
              playerObj.should.be.type('object');
          });

          it('Should return players type', function () {
              playerObj.type.should.be.equal('player');
          });

          it('Should return players password', function () {
              playerObj.password.should.be.equal('123');
          });

          it('Should return players explored count', function () {
              playerObj.explored.should.be.equal(1);
          });

          it('Should return total rooms count', function () {
              playerObj.totalRooms.should.be.equal(2);
          });

          it('Should return players questpoints', function () {
              playerObj.questPoints.should.be.equal(0);
          });

          it('Should return players gold', function () {
              playerObj.gold.should.be.equal(0);
          });

          it('Should return players silver', function () {
              playerObj.silver.should.be.equal(150);
          });

          it('Should return players copper', function () {
              playerObj.copper.should.be.equal(0);
          });

          it('Should return players hitRoll', function () {
              playerObj.hitroll.should.be.equal(1);
          });

          it('Should return players damroll', function () {
              playerObj.damroll.should.be.equal(1);
          });

          it('Should return players wimpy', function () {
              playerObj.wimpy.should.be.equal(25);
          });

          it('Should return players hours', function () {
              playerObj.hours.should.be.equal(0);
          });

          it('Should return players mkills', function () {
              playerObj.mkills.should.be.equal(0);
          });

          it('Should return players mDeaths', function () {
              playerObj.mDeaths.should.be.equal(0);
          });

          it('Should return players pkKills', function () {
              playerObj.pkKills.should.be.equal(0);
          });

          it('Should return players pkDeaths', function () {
              playerObj.pkDeaths.should.be.equal(0);
          });


          it('Should return players pkPoints', function () {
              playerObj.pkPoints.should.be.equal(0);
          });

          it('Should return players weight', function () {
              playerObj.weight.should.be.equal(0);
          });

          it('Should return players maxWeight', function () {
              playerObj.maxWeight.should.be.equal(105);
          });

          it('Should return players status', function () {
              playerObj.status.should.be.equal('Standing');
          });
         
      });


      

     it('Should return players Keywords', function () {
         let playerKeywords = player.getKeywords();

         playerKeywords[0].should.be.equal('testPlayer');
         playerKeywords[1].should.be.equal('self');
     });


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

    describe('Should return players information Object', function () {
  
        let playerInfo = player.getInformation();

        it('should return players level', function () {
            playerInfo.level.should.be.equal(1);
        });
 
        it('should return players race', function () {
            playerInfo.race.should.be.equal('Elf');
        });

        it('should return players class', function () {
            playerInfo.class.should.be.equal('Mage');
        });

        it('should return players alignment', function () {
            playerInfo.alignment.should.be.equal('Neutral');
        });

        it('should return players alignmentScore', function () {
            playerInfo.alignmentScore.should.be.equal(0);
        });

        it('should return players alignmentScore', function () {
            playerInfo.alignmentScore.should.be.equal(0);
        });

        it('should return players experience', function () {
            playerInfo.experience.should.be.equal(0);
        });

        it('should return players TNL', function () {
            playerInfo.experienceToNextLevel.should.be.equal(3000);
        });

        it('should return players max HP', function () {
            playerInfo.maxHitpoints.should.be.equal(35);
        });

        it('should return players HP', function () {
            playerInfo.hitpoints.should.be.equal(35);
        });

        it('should return players Mana', function () {
            playerInfo.mana.should.be.equal(100);
        });

        it('should return players max mana', function () {
            playerInfo.maxMana.should.be.equal(100);
        });
   
        it('should return players Moves', function () {
            playerInfo.moves.should.be.equal(100);
        });

        it('should return players max moves', function () {
            playerInfo.maxMoves.should.be.equal(100);
        });

        it('should return players strength', function () {
            playerInfo.stats.strength.should.be.equal(21);
        });

        it('should return players dexterity', function () {
            playerInfo.stats.dexterity.should.be.equal(15);
        });
       
        it('should return players constitution', function () {
            playerInfo.stats.constitution.should.be.equal(14);
        });
        
        it('should return players intelligence', function () {
            playerInfo.stats.intelligence.should.be.equal(13);
        });

        it('should return players wisdom', function () {
            playerInfo.stats.wisdom.should.be.equal(17);
        });

        it('should return players charisma', function () {
            playerInfo.stats.charisma.should.be.equal(20);
        });
    });

    it('Should return player Socket', function () {
        let playerSocket = player.getSocket();

        playerSocket.should.be.equal('');

    });

    it('Should return player Inventory', function () {
        let playerInv = player.getInventory();

        playerInv.should.be.an.Array();

    });

    describe('Should return active player Channels', function () {
        let playerChannels = player.getChannels();

        it('Should return gossip channel status', function () {
            playerChannels.gossip.should.be.equal(1);
        });

        it('Should return auction channel status', function () {
            playerChannels.auction.should.be.equal(1);
        });

        it('Should return ask channel status', function () {
            playerChannels.ask.should.be.equal(1);
        });

        it('Should return clan channel status', function () {
            playerChannels.clan.should.be.equal(1);
        });

        it('Should return newbie channel status', function () {
            playerChannels.newbie.should.be.equal(1);
        });
    });

    it('Should return player Prompt', function () {
        let playerPrompt = player.getPrompt(true);

        playerPrompt.should.be.equal("HP: 35/35 Mana: 100/100 Moves: 100/100 Tnl: 3000");

    });

    it('Should return player Equipment', function () {
        let playerEQ = player.findEquipment();

        playerEQ.should.be.Array();
        playerEQ.should.have.lengthOf(0);

    });

    it('Should set player Description', function () {

        player.setDescription('You see somthing special about them');

        let playerDesc = player.getDescription();

        playerDesc.should.be.equal('You see somthing special about them');
   

    });

  });
 
 
});
