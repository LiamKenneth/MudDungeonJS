'use strict';

describe('Player Manger:', function () {

  const should        = require('should');
  const MockedSocket  = require('socket-io-mock');
  const playerClass = require('../../../../Game/Core/PlayerSetup/player').player;
  const playerManager = require('../../../../Game/Core/PlayerSetup/player-manager').playerManager;
  const playerJson    = require('../../../Mock/testPlayer');
  const roomObject    = require('../../../../Game/World/valston/prison.js');


    /*
     * TODO: LoadPLayer test, removePlayerFromRoom, each, getPlayers, broadcast, broadcastToRoom, broadcastPlayerEvent, broadcastToChannel
     */

  it('Should add player to players array', () => {

      playerManager.addPlayer(playerJson);

      let players = playerManager.getPlayers();

      players.should.have.length(1);

 
  });


  it('Should remove player from players array', () => {

      let fakeSocket = new MockedSocket();

      playerJson.socket = fakeSocket;

      playerManager.removePlayer(fakeSocket);

     let players = playerManager.getPlayers();

     players.should.have.length(0);

    
  });


     it('Should add player to room', () => {

      playerManager.addPlayerToRoom(playerJson, 'valston', 'prison', 0);

     let room = roomObject['prison'][0];

     room.players.should.have.length(1);

    
     });


     it('Should remove player from room', () => {

         let room = roomObject['prison'][0];
         let playerSocket = playerJson.socket;

         playerManager.removePlayerFromRoom(playerSocket, room.players);

     room.players.should.have.length(0);

    
});

     it('Should loop array', () => {

         let player = playerManager.getPlayers();
         var i = 0;

     playerManager.each(function (player) {
         i++;
     });

         i.should.be.equal(0);


     });



         //it('Should broadcast to players', () => {

         //    let player = new playerClass(playerJson);
         //playerManager.addPlayer(player);

 
         //let fakeSocket = new MockedSocket();

         //    playerManager.broadcast('just testing here');

         //    fakeSocket.on('data', function(message) {
         //        message.should.be.equal('just testing here')
         //    });


         //});


   //describe('Should add and remove player from players array', function () {

   
   //});
 
 
});
