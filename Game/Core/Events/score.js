(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
        room: r('../Rooms/roomFunctions'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        commands: r('../commands'),
        events: {
            enterRoom: r('./enterRoom'),
            exits: r('./findExits'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

    var score = function(socket, player) {
        console.time('Score')
        var scoreSheet = modules.data.loadFile(null, 'score');


        var name = player.getName();
        var desc = player.getDescription();
        var Class = player.getClass();
        var race = player.getRace();
        var age = player.getAge();
        var level = player.getLevel();
        var info = player.getPlayerInfo();

        function pad(value, length, position) {

            if (position == 'left') {
               
                    return (value.toString().length < length) ? pad(" " + value, length, 'left') : value;
                
            } else if (position == 'right') {
               
                    return (value.toString().length < length) ? pad(value + " ", length, 'right') : value;
                 
            }
        };


        var data = {
            pName: name,
            pDesc: desc,
            pClass: pad(Class, 10, 'right'),
            pRace: pad(race, 10, 'right'),
            pSex: pad(info.sex, 10, 'right'),
            pAge: pad(age, 10, 'right'),
            pHP: pad(info.information.hitpoints, 5, 'left'),
            HPMax: pad(info.information.maxHitpoints, 5, 'right'),
            pMana: pad(info.information.mana, 5, 'left'),
            ManaMax: pad(info.information.maxMana, 5, 'right'),
            pMoves: pad(info.information.moves, 5, 'left'),
            MovesMax: pad(info.information.maxMoves, 5, 'right'),
            pLevel: pad(level, 10, 'right'),
            pAlign: pad(info.information.alignment, 12, 'right'),
            pTNL: pad(info.information.experienceToNextLevel, 11, 'left'),
            pStr: pad(info.information.stats.strength, 3, 'left'),
            StrMax: pad(info.information.stats.strength, 3, 'right'),
            pDex: pad(info.information.stats.dexterity, 3, 'left'),
            dexMax: pad(info.information.stats.dexterity, 3, 'right'),
            pCon: pad(info.information.stats.constitution, 3, 'left'),
            conMax: pad(info.information.stats.constitution, 3, 'right'),
            pInt: pad(info.information.stats.intelligence, 3, 'left'),
            intMax: pad(info.information.stats.intelligence, 3, 'right'),
            pWis: pad(info.information.stats.wisdom, 3, 'left'),
            wisMax: pad(info.information.stats.wisdom, 3, 'right'),
            pCha: pad(info.information.stats.charisma, 3, 'left'),
            chaMax: pad(info.information.stats.charisma, 3, 'right'),
            pGold: pad(info.gold, 11, 'left'),
            pSilver: pad(info.silver, 11, 'left'),
            pCopper: pad(info.copper, 11, 'left'),
            pExplore: pad(info.explored, 5, 'left'),
            pHitRoll: pad(info.hitroll, 5, 'left'),
            pDamRoll: pad(info.damroll, 5, 'left'),
            pHours: pad(info.hours, 12, 'left'),
            pMkills: pad(info.mkills, 5, 'left'),
            pMDeaths: pad(info.mDeaths, 5, 'left'),
            pWeight: pad(info.weight, 3, 'left'),
            maxWeight: pad(info.maxWeight, 3, 'right'),
            pStatus: pad(info.status, 12, 'right'),
            pWimpy: pad(info.wimpy, 12, 'right'),
            pPKills: pad(info.pkKills, 5, 'left'),
            pPKDeaths: pad(info.pkKills, 5, 'left'),
            pDeaths: pad(info.pkDeaths, 5, 'left'),
            pPKPoints: pad(info.pkPoints, 5, 'left'),
        };

        scoreSheet = scoreSheet.replace(/(pName)|(pDesc)|(pAge)|(pWeight)|(maxWeight)|(pStatus)|(pHP)|(HPMax)|(pMana)|(ManaMax)|(pHours)|(pMkills)|(pMDeaths)|(pHitRoll)|(pDamRoll)|(pWimpy)|(pMoves)|(MovesMax)|(pTNL)|(pExplore)|(pSex)|(pGold)|(pCopper)|(pSilver)|(pClass)|(pRace)|(pLevel)|(pAlign)|(pPKills)|(pPKDeaths)|(pPKPoints)|(pStr)|(StrMax)|(pDex)|(dexMax)|(pCon)|(conMax)|(pInt)|(intMax)|(pWis)|(wisMax)|(pCha)|(chaMax)/g, function(matched) {

            return data[matched];
        });
        console.timeEnd('Score');

        /// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings scoreSheet.replace("#desc#", description);

        modules.helper.helpers.send(socket, scoreSheet);

    }
    exports.score = score;
})(require);