var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

describe("Look Event", function() {

    var modules = {
        data: require('./../../Game/Core/data.js').data,
        helper: require('./../../Game/Core/helpers').helpers,
        commands: require('./../../Game/Core/commands'),
        fs: require('fs'),
        world:
        {
            valston: require('./../../Game/World/valston/prison')
        },
        playerSetup:
        {
            player: require('./../../Game/Core/PlayerSetup/player-manager')
        },
        color: require('colors'),
        events: require('./../../Game/Core/events.js')

    };



    describe("look at room", function() {
        it("should show a description of the room", function() {

            //setup
            var playerData = JSON.parse(modules.data.loadFile('null','pug.json'));

          //var displayItem =  modules.events.events.look(null, playerData, 'at', 'sword');


            expect(playerData).should.exist;
        });
    });

    //describe("savePlayer", function() {
    //    it("Should save the player in JSON, using thier name", function() {
    //
    //        var player = {name: "test" }
    //
    //        modules.data.savePlayer(player);
    //
    //        var playerFile =  modules.fs.readFileSync('Data/test.json').toString('utf8');
    //
    //        expect(playerFile).should.exist;
    //
    //    });
    //
    //});
});
