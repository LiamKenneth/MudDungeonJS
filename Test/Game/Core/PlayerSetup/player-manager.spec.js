'use strict';

describe('Player Manger:', function() {

    const should = require('should');
    const sinon = require('sinon');
    const MockedSocket = require('socket-io-mock');
    const playerManager = require('../../../../Game/Core/PlayerSetup/player-manager').playerManager;
    const playerClass = require('../../../../Game/Core/PlayerSetup/player').player;
    const playerJson = require('../../../Mock/testPlayer');
    const modules = {
        room: require('../../../../Game/Core/Rooms/roomFunctions')
    }
    const roomObject = require('../../../../Game/World/valston/prison.js');
    const io = require('socket.io');



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
    it('Should Broadcast to players', () => {

        let player = new playerClass(playerJson);

        let socket = {
            write: sinon.spy()
        };

        player.setSocket(socket);

        playerManager.addPlayer(player);


        playerManager.broadcast('testing broadcast to all player');

        //Helpers send function
        socket.write.should.be.calledOnce;


    });

    it('Should Broadcast players action to room', () => {

        let player = new playerClass(playerJson);
        let playerJson2 = require('../../../Mock/testPlayer');
        playerJson2.name = "bob";
        let player2 = new playerClass(playerJson2);

        let socket = {
            write: sinon.spy()
        };
        let response = {
            "forRoom": 'Liam says only testing',
            "forPlayer": 'You say only testing'
        };
        player.setSocket(socket);
        player2.setSocket(socket);

        playerManager.addPlayer(player);
        playerManager.addPlayer(player2);

        let location = JSON.parse(player.getLocation());
        let room = modules.room.room.playerLocation(location);

        room.players.push(player);
        room.players.push(player2);

        playerManager.broadcastPlayerEvent(player, room.players, response);

        //Helpers send function
        socket.write.should.be.calledOnce;


    });


    it('Should Broadcast to channel', () => {

        let player = new playerClass(playerJson);
        let playerJson2 = require('../../../Mock/testPlayer');
        playerJson2.name = "bob";
        let player2 = new playerClass(playerJson2);
        let socket = {
            write: sinon.spy()
        };
        player.setSocket(socket);
        player2.setSocket(socket);

        playerManager.addPlayer(player);
        playerManager.addPlayer(player2);

        let response = {
            "forChannel": 'Liam newbies Help how do I test',
            "forPlayer": 'You newbie Help how do I test'
        };


        playerManager.broadcastToChannel(player, 'Help how do I test', 'newbie', response);

        //Helpers send function
        socket.write.should.be.calledOnce;


    });

    it('Should loop array', () => {

        let player = playerManager.getPlayers();
        var i = 0;

        playerManager.each(function(player) {
            i++;
        });

        i.should.be.equal(5);


    });


 

        //describe('loadPlayer test', function () {



        //    let spy;
        //    let spyWrite

        //    before(function () {
        //        // let socketio = io({ forceNew: true });
        //        this.pc = new playerClass(playerJson);
        //        let socket = {
        //            write: sinon.spy(),
        //            once: function(input) {
   
        //            }
        //        };

        //        this.pc.setSocket(socket);

        //        this.socket = this.pc.getSocket();

        //        // Spy on the once method 
        //        spy = sinon.spy(this.socket, 'once');
        //        spyWrite = sinon.spy(this.socket, 'write');

        //        // Now stub pc's getSocket method so it returns our special version of the socket
        //        sinon.stub(this.pc, 'getSocket', () => this.socket);

        //        // Run the function with our special pc object
        //        playerManager.loadPlayer(this.pc);
        //    });

        //    after(function () {
        //        // Clean up after ourselves
        //        this.pc.restore();
        //        this.socket.restore();
        //    });

        //    it('calls socket.once() with a data callback', function () {

        //        spy.callCount.should.be.equal(1);

        //        spy.firstCall.args[0].should.be.equal('data');
                
        //    });

        //    describe('callback', function () {
        //        let callback = spy.firstCall.args[1];          

        //        callback.callArgWith('123');

        //        spyWrite.callCount.should.be.equal(1);

        //    });

        // });



});