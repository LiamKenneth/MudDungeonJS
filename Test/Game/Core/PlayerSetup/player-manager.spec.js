'use strict';

describe('Player Manger: Manages players in game', function () {

  const should        = require('should');
  const mockedSocket  = require('socket-io-mock');
  const playerManager = require('../../../../Game/Core/PlayerSetup/player-manager').playerManager;
  const playerJson    = require('../../../Mock/testPlayer');


    /*
     * TODO: LoadPLayer test, removePlayerFromRoom, each, getPlayers, broadcast, broadcastToRoom, broadcastPlayerEvent, broadcastToChannel
     */

  it('Should add player to players array', () => {

      playerManager.addPlayer(playerJson);

      let players = playerManager.getPlayers();

      players.should.have.length(1);

 
  });


  it('Should remove player from players array', () => {

      let fakeSocket = new mockedSocket();

      playerJson.socket = fakeSocket;

      playerManager.removePlayer(fakeSocket);

     let players = playerManager.getPlayers();

     players.should.have.length(0);

     

  });




   //describe('Should add and remove player from players array', function () {

   
   //});
 
 
});
