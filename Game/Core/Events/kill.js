(function(r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data'),
        room: r('../Rooms/roomFunctions'),
        playerSetup: {
            player: r('../PlayerSetup/player-manager')
        },
        commands: r('../commands'),
        events: {
            enterRoom: r('./enterRoom'),
            exits: r('./findExits'),
            findObject: r('./findObject'),
        },
        loadPlayerLocation: r('../loadRoom'),
        world: {
            valston: r('../../World/valston/prison')
        },
    };

        var kill = {
            findMob: function(playerInfo, target) {

                var location = JSON.parse(playerInfo.getLocation());
                var room = modules.room.room.playerLocation(location);

                modules.events.findObject.findObject(playerInfo, room, target, 'kill');

            },
            combatTimer: function(time) {
                attackerObj
                return time || 1200;
            },
            combatRound: function(playerInfo, target, time, type) {
                return setInterval(function() {

                    kill.startCombat(playerInfo, target, type);

                }, time);
            },

            initCombat: function (attackerObj, defenderObj, room) {
                //better way to do this?
                //combat speed will not be hard coded just testing
                // spells like slow and haste will need to change the speed also,


                function combatRound(attackerObj, defenderObj, speed, isPlayer, isAttacker, isNamedMob, room) {

                    var chanceToHit = function(attackerObject, defenderObject) {

                        function hitRate(info) {


                            //weapon skill + (dex / 5) + (luck / 10 ) + (lvl / 5) * (current moves / maxMoves);
                            return (.95 + (info.stats.dexterity / 5) + (info.stats.luck / 10)) * (info.moves / info.maxMoves);

                        }

                        function dodge(info) {


                            //(dodge skill  + (dex / 5) + (luck / 10) + (lvl / 5) * (current moves / maxMoves);
                            return (0 + (info.stats.dexterity / 5) + (info.stats.luck / 10)) * (info.moves / info.maxMoves);

                        }

                        let hitChance = Math.floor(hitRate(attackerObject.information) * 100) - Math.floor(dodge(defenderObject.information) * 100);

                        console.log("hitRate " + hitRate(attackerObject.information))
                        console.log("dodge " + dodge(defenderObject.information))
                        console.log("hitChance " + hitChance)

                        if (hitChance >= 100) {
                            return 95;
                        } else if (hitChance <= 0) {

                            return 5;
                        }

                        return hitChance;
                    }

                    var calcDamage = function(object) {
                        //(Weapon Damage * Strength Modifier * Condition Modifier * Critical Hit Modifier) / Armor Reduction.
                        let strength = object.information.stats.strength;
                        let endurance = object.information.moves / object.information.maxMoves;
                        let weaponDamage = null;

                        //if (object.stats) {
                        //    let minDam = object.stats.damMin;
                        //    let maxDam = object.stats.damMax;
                        //    weaponDamage = Math.floor(Math.random() * (maxDam - minDam + 1) + minDam);
                        //}


                        if (weaponDamage === null) {
                            //no weapon
                            weaponDamage = Math.floor(Math.random() * (1 * strength - 1 + 1) + 1);
                        }

                        return Math.floor((weaponDamage * 0.5 + strength / 100 * endurance * 1));

                    }

                    var damageText = function(damage) {

                        if (damage < 25) {

                            if (damage <= 4) {
                                return '{gscratches{x';
                            } else if (damage <= 8) {
                                return '{Ggrazes{x';
                            } else if (damage <= 12) {
                                return 'hits';
                            } else if (damage <= 16) {
                                return 'injures';
                            } else if (damage <= 20) {
                                return 'wounds';
                            } else if (damage <= 24) {
                                return 'mauls';
                            }

                        } else {

                            if (damage <= 24) {
                                return 'decimates';
                            } else if (damage <= 28) {
                                return 'devastates';
                            } else if (damage <= 32) {
                                return 'maims';
                            } else if (damage <= 36) {
                                return 'MUTILATES';
                            } else if (damage <= 40) {
                                return 'DISEMBOWELS';
                            } else if (damage <= 48) {
                                return 'MASSACRES';
                            } else if (damage <= 100) {
                                return '*** DEMOLISHES ***';
                            } else {
                                return '*** ANNIHILATES ***';
                            }
                        }

                    }

                    var healthText = function(hp, maxHp, isPlayer, mobName) {

                        let hpPercent = (hp / maxHp) * 100;
                        let personYouAre;
                        let personYou;

                        if (isPlayer) {
                            personYouAre = "You're ";
                            personYou = "You have ";
                        } else {
                            personYouAre = 'is ';
                            personYou = 'has ';
                        }

                        if (hpPercent >= 100) {

                            if (hpPercent >= 100) {
                                return personYouAre + 'in perfect health.';
                            } else if (hpPercent >= 90) {
                                return personYouAre + 'slightly scratched.';
                            } else if (hpPercent >= 80) {
                                return personYou + 'a few bruises.';
                            } else if (hpPercent >= 70) {
                                return personYou + 'some cuts.';
                            } else if (hpPercent >= 60) {
                                return personYou + 'several wounds.';
                            } else if (hpPercent >= 50) {
                                return personYou + 'many nasty wounds.';
                            }

                        } else {
                            if (hpPercent >= 40) {
                                return personYouAre + 'bleeding freely.';
                            } else if (hpPercent >= 30) {
                                return personYouAre + 'covered in blood.';
                            } else if (hpPercent >= 20) {
                                return personYouAre + 'leaking guts.';
                            } else if (hpPercent >= 10) {
                                return personYouAre + 'almost dead.';
                            } else {
                                return personYouAre+ "DYING";
                            }
                        }

                    }

                    var anOra = function(name) {
                        if (name == 'a' || name == 'e' || name == 'i' || name == 'o' || name == 'u') {

                            return 'an';

                        } else {

                            return 'a';
                        }
                    }

                    var calcExperience = function(attackerLevel, defenderLevel, xpBonus) {

                        let xpMod = (defenderLevel - attackerLevel) * 100;

                        if (xpMod < 0) {
                            xpMod = 100;
                        }

                        return Math.floor((defenderLevel / attackerLevel) * xpMod) + xpBonus;
                    };

                    var isAlive = function(object) {

                        if (object.information.hitpoints <= 0) {
                            return false;
                        }

                        return true;
                    }

                    var fight = function (attackerObj, defenderObj, isAttacker, isNamedMob, speed, room) {
                        //TODO dynamic atack names based on weapon
                        // 
                        
                      
 
                        speed = 3200;
                        var hitChance = 0;
                        var chance = 0;
                        var attacker = {
                            obj: attackerObj,
                            isAlive: true,
                            isPlayer: false,
                            socket: function () {
                                if (typeof attacker.obj.getSocket == "function") {
                                    console.log("yes it is a variable")
                                    attacker.isPlayer = true;
                                    return attacker.obj.getSocket();
                                }
                            }
                        };
                        var defender = {
                            obj: defenderObj,
                            isAlive: true,
                            isPlayer: false,
                            socket: function () {
                                if (typeof defender.obj.getSocket == "function") {
                                    defender.isPlayer = true;
                                    return defender.obj.getSocket();
                                }
                            }
                        };
                        var location;
                        var playerRoom;

                        if (typeof attacker.obj.getSocket == "function") {
                            location = JSON.parse(attacker.obj.getLocation());
                            playerRoom = modules.room.room.playerLocation(location);

                          //  console.log(playerRoom.mobs[0])
                        }
                        else if (typeof defender.obj.getSocket == "function") {
                            location = JSON.parse(defender.obj.getLocation());
                            playerRoom = modules.room.room.playerLocation(location);
                        }

                        console.log("is player " + attacker.isPlayer)

                        

                        var attackerSocket = attacker.socket();
                        var defenderSocket = defender.socket();
                        var attackerNameStartsWith = attacker.obj.name.substr(0, 1).toLowerCase();
                        var defenderNameStartsWith = defender.obj.name.substr(0, 1).toLowerCase();
                        var response = {
                            forRoom: "",
                            forAttacker: "",
                            forDefender: ""
                        }

                        //Check if attacker or defender is alive
                        attacker.isAlive = isAlive(attacker.obj);
                        defender.isAlive = isAlive(defender.obj);


                        setTimeout(function () {

                      

                        if (!attacker.isAlive || !defender.isAlive) {
                            //end fight
                            return;
                        }

                        //Check hitchance for attacker and defender
                        hitChance = chanceToHit(attacker.obj, defender.obj);

                        //Roll chance for attacker and defender
                        chance = modules.helper.helpers.dice(1, 100);

                        if (hitChance >= chance) {

                            if (isAttacker) {
                                if (!attacker.isAlive || !defender.isAlive) {
                                    //end fight
                                    return;
                                }
                                let damage = calcDamage(attacker.obj);


                                if (!isNamedMob) {

                                    response.forRoom = attacker.obj.name + ' stabs' + anOra(defender.obj.name) + defender.obj.name;
                                    response.forAttacker = anOra(defender.obj.name) + ' ' + defender.obj.name;
                                    response.forDefender = anOra(attacker.obj.name) + ' ' + attacker.obj.name;

                                } else {
                                    //Named mobbed or PK
                                    response.forRoom = attacker.obj.name + ' stabs ' + defender.obj.name;
                                    response.forAttacker = defender.obj.name;
                                }

                                modules.helper.helpers.send(attackerSocket, "{WYour stab " + damageText(damage) + "{W " + response.forAttacker + ". {R[" + damage + "]{x");
                                modules.helper.helpers.send(attackerSocket, "{W " + response.forAttacker + " " + healthText(defender.obj.information.hitpoints, defender.obj.information.maxHitpoints));

                                //check defender
                                defenderObj.information.hitpoints -= damage;

                                if (defender.obj.information.hitpoints <= 0) {
                                    modules.helper.helpers.send(attackerSocket, defender.obj.name + " squeeks and dies");
                                    modules.helper.helpers.send(attackerSocket, "You killed " + response.forAttacker + " and gained " + calcExperience(attacker.obj.information.level, defender.obj.information.level, 0) + " experience");

                                  //  playerManager.removePlayerFromRoom(defender.obj.socket, wtfRoom?)
                                    //Remove from MOB/Player Array
                                    //Add corpse to items array
                                    var arr;
                                    if (defender.isPlayer === false) {

                                        arr = playerRoom.mobs;

                                    } else {
                                        arr = playerRoom.players;
                                    }
                                    var arrLength = arr.length || 0;


                                        for (var i = 0; i <= arrLength; i++) {
                                            //remove on id instead?

                                            if (arr[i].name === defender.obj.name) {
  
                                                arr.splice(i, 1);

                                                var corpse = {
                                                    name: 'A corpse of a dead ' + defender.obj.name + ' is here.',
                                                    items: defender.obj.inventory
                                                }

                                                playerRoom.corpses.push(corpse);
   
                                                break;
                                            }
                                        }
                                   
                                    return;
                                }

                                //tell defender they are getting hit


                               // modules.helper.helpers.send(defenderSocket, response.forDefender + " " + attacker.obj.name + " stabs you");
                                modules.helper.helpers.send(defenderSocket, "{W" + attacker.obj.name + " stabs " + damageText(damage) + "you. {R[" + damage + "]{x");

                                modules.helper.helpers.send(defenderSocket, "{WYou're" + healthText(defenderObj.information.hitpoints, defenderObj.information.maxHitpoints));


                            } else {
                                if (!attacker.isAlive || !defender.isAlive) {
                                    //end fight
                                    return;
                                }
                                // defender
                                let damage = calcDamage(defender.obj);

                                if (!isNamedMob) {

                                    response.forRoom = attacker.obj.name + ' stabs' + anOra(defender.obj.name) + defender.obj.name;
                                    response.forAttacker = anOra(defender.obj.name) + ' ' + defender.obj.name;
                                    response.forDefender = anOra(attacker.obj.name) + ' ' + attacker.obj.name;

                                } else {
                                    //Named mobbed or PK
                                    response.forRoom = attacker.obj.name + ' stabs ' + defender.obj.name;
                                    response.forAttacker = defender.obj.name;
                                }

                                // tell attacker they got hit

                                modules.helper.helpers.send(attackerSocket, defender.obj.name + " bites you");
                                modules.helper.helpers.send(attackerSocket, "{W" + defenderObj.name + " bites " + damageText(damage) + " you. {R[" + damage + "]{x");

                                modules.helper.helpers.send(attackerSocket, "{WYour " + healthText(attackerObj.information.hitpoints, attackerObj.information.maxHitpoints));


                                //tell defender hey got hit
                                modules.helper.helpers.send(defenderSocket, "{WYour stab " + damageText(damage) + "{W a " + attackerObj.name + ". {R[" + damage + "]{x");

                                modules.helper.helpers.send(defenderSocket, "{WA " + attackerObj.name + " " + healthText(attackerObj.information.hitpoints, attackerObj.information.maxHitpoints));

                                attackerObj.information.hitpoints -= damage;

                                if (attackerObj.information.hitpoints <= 0) {
                                    modules.helper.helpers.send(defenderSocket, attackerObj.name + " squeeks and dies");
                                    modules.helper.helpers.send(defenderSocket, "You killed " + response.forAttacker + " and gained " + calcExperience(attacker.obj.information.level, defender.obj.information.level, 0) + " experience");
                                    return;
                                }

                            }

                        } else {
                            //miss

                            if (isAttacker) {


                                modules.helper.helpers.send(attackerSocket, "You miss " + anOra(defenderObj.name) + " " + defenderObj.name);

                                modules.helper.helpers.send(defenderSocket, anOra(defenderObj.name) + " " + attackerObj.name + " misses you.");


                            } else {

                                modules.helper.helpers.send(attackerSocket, defenderObj.name + " misses you");

                                modules.helper.helpers.send(defenderSocket, "You miss " + anOra(attackerObj.name) + " " + attackerObj.name);
                            }

                           
                        }

                        if (typeof attackerObj.getSocket === "function") {
                            let socket = attackerObj.getSocket();
                            modules.helper.helpers.send(socket, attackerObj.getPrompt(true));

                        }

                        if (typeof defenderObj.getSocket === "function") {
                            let defenderSocket = defenderObj.getSocket();
                            modules.helper.helpers.send(defenderSocket, defenderObj.getPrompt(true));
                        }
                        fight(attackerObj, defenderObj, isAttacker, isNamedMob, 1000, room);

                        }, speed);
                    }

                    //attackerObj, defenderObj, isAttacker, isNamedMob, speed
                    fight(attackerObj, defenderObj, isAttacker, isNamedMob, speed);
                     
                   
                }


                // refactor!
           
                //attackerObj, defenderObj, speed, isPlayer, isAttacker, isNamedMob

            combatRound(attackerObj, defenderObj, 1000, true, true, true, room);
            combatRound(attackerObj, defenderObj, 1200, false, false, false, room);



        },
        startCombat: function(playerInfo, target, type) {
            //don't allow disconenct if fighting?
            //todo add HP loss
            //add actually hitting
            //add dieing


        }


    }
    exports.kill = kill;
})(require);