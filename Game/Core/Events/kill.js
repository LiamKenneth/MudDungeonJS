(function (r) {
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

        findMob: function (playerInfo, target) {

            var location = JSON.parse(playerInfo.getLocation());
            var room = modules.room.room.playerLocation(location);

            modules.events.findObject.findObject(playerInfo, room, target, 'kill');

        },
        combatTimer: function(time) {
            return time || 1200;
        },
        combatRound: function (playerInfo, target, time, type) {
            return setInterval(function () {
          
                kill.startCombat(playerInfo, target, type);
             
            }, time);
        },

        initCombat: function (playerInfo, target) {
            //better way to do this?
            //combat speed will not be hard coded just testing
            // spells like slow and haste will need to change the speed also,

            //TODO ChanceToHit formula doesn't work very well
            //TODO HealthText needs rewording for player
            //TODO Use victim socket during fight if PK
            //TODO Player damage and death
            //TODO damage + Weapon equipped stats
            //TODO improve prompt styling
            //Refactors

            function combatRound(playerMobObj, target, speed, isPlayer) {

                var chanceToHit = function(attackerObject, defenderObject) {

                    function hitRate(info) {

             
                        //weapon skill + (dex / 5) + (luck / 10 ) + (lvl / 5) * (current moves / maxMoves);
                        return (.95 + (info.stats.dexterity / 5 * 100) + (info.stats.luck / 10 * 100)) * (info.moves / info.maxMoves);

                    }

                    function dodge(info) {

                                
                        //(dodge skill  + (dex / 5) + (luck / 10) + (lvl / 5) * (current moves / maxMoves);
                        return (.95 + (info.stats.dexterity / 5 * 100) + (info.stats.luck / 10 * 100)) * (info.moves / info.maxMoves);

                    }

                    let hitChance = Math.floor(hitRate(attackerObject.information) * 100) - Math.floor(dodge(defenderObject.information) * 100);

                    console.log("hitRate " + hitRate(attackerObject.information))
                    console.log("dodge " + dodge(defenderObject.information))
                    console.log("hitChance " + hitChance)

                    if (hitChance >= 100) {
                       return 95;
                    }
                    else if (hitChance <= 0) {

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

                var damageText = function (damage) {

                    if (damage < 25) {

                        if (damage <= 4) {
                            return '{gscratches{x';
                        }
                        else if (damage <= 8) {
                            return '{Ggrazes{x';
                        }
                        else if (damage <= 12) {
                            return 'hits';
                        }
                        else if (damage <= 16) {
                            return 'injures';
                        }
                        else if (damage <= 20) {
                            return 'wounds';
                        }
                        else if (damage <= 24) {
                            return 'mauls';
                        }

                    } else {

                        if (damage <= 24) {
                            return 'decimates';
                        }
                        else if (damage <= 28) {
                            return 'devastates';
                        }
                        else if (damage <= 32) {
                            return 'maims';
                        }
                        else if (damage <= 36) {
                            return 'MUTILATES';
                        }
                        else if (damage <= 40) {
                            return 'DISEMBOWELS';
                        }
                        else if (damage <= 48) {
                            return 'MASSACRES';
                        }
                        else if (damage <= 100) {
                            return '*** DEMOLISHES ***';
                        } else {
                            return '*** ANNIHILATES ***';
                        }
                    }
 
                }

                var healthText = function (hp, maxHp) {

                    let hpPercent = (hp / maxHp) * 100;

                    if (hpPercent >= 100) {

                        if (hpPercent >= 100) {
                            return 'is in perfect health.';
                        }
                        else if (hpPercent >= 90) {
                            return 'is slightly scratched.';
                        }
                        else if (hpPercent >= 80) {
                            return 'has a few bruises.';
                        }
                        else if (hpPercent >= 70) {
                            return 'has some cuts.';
                        }
                        else if (hpPercent >= 60) {
                            return 'has several wounds.';
                        }
                        else if (hpPercent >= 50) {
                            return 'has many nasty wounds.';
                        }
  
                    } else {
                        if (hpPercent >= 40) {
                            return 'is bleeding freely.';
                        }
                        else if (hpPercent >= 30) {
                            return 'is covered in blood.';
                        }
                        else if (hpPercent >= 20) {
                            return 'is leaking guts.';
                        }
                        else if (hpPercent >= 10) {
                            return 'is almost dead.';
                        } else {
                            return "is DYING";
                        }
                    }
                  
                }

                var calcExperience = function (playerlevel, targetLevel, xpBonus) {

                    let xpMod = (targetLevel - playerlevel) * 100;

                    if (xpMod <= 0) {
                        xpMod = 100;
                    }  

                    return Math.floor((targetLevel / playerlevel) * xpMod) + xpBonus;
                };

                var isAlive = function (object) {
                    
                    if (object.information.hitpoints <= 0) {
                        return false;
                    }

                    return true;
                }


                setTimeout(function () {

                    let hitChance;
                    let alive;

                    if (isPlayer) {
                        alive = isAlive(target);
                        if (!alive) { return;  }

                      hitChance = chanceToHit(playerMobObj, target);
                    } else {
                        alive = isAlive(target);
                        if (!alive) {return; }

                        hitChance = chanceToHit(target, playerMobObj);
                    }

                    let chance =  modules.helper.helpers.dice(1, 100);

                    if (isPlayer) {
                        let socket = playerMobObj.getSocket();
                        modules.helper.helpers.send(socket, "Your chanceToHit " + hitChance + " %");

                    } else {
                        let socket = playerMobObj.getSocket();
                        modules.helper.helpers.send(socket, "taret chanceToHit " + hitChance + " %");
                    }

                    //Put this in a function & refactor
                    if (hitChance >= chance) {
                        //hit?
                        if (isPlayer) {
                            let socket = playerMobObj.getSocket();
                            let damage = calcDamage(playerMobObj);

                         

                            modules.helper.helpers.send(socket, "{WYour stab " + damageText(damage) + "{W a " + target.name + ". {R[" + damage + "]{x");
                           
                            target.information.hitpoints -= damage;

                            modules.helper.helpers.send(socket, "{WA " + target.name + " " + healthText(target.information.hitpoints, target.information.maxHitpoints));


                            if (target.information.hitpoints <= 0) {
                                modules.helper.helpers.send(socket, target.name + " squeeks and dies");
                                modules.helper.helpers.send(socket, "You killed a rat and gained " + calcExperience(playerMobObj.information.level, target.information.level, 0) + " experience");
                                return;
                            }

                        } else {
                            let socket = playerMobObj.getSocket();
                            let damage = calcDamage(target);

                            modules.helper.helpers.send(socket, target.name + " bites you");
                            modules.helper.helpers.send(socket, "{WA" + target.name + " bite " + damageText(damage) + "you. {R[" + damage + "]{x");

                            modules.helper.helpers.send(socket, "{WYour " + healthText(playerMobObj.information.hitpoints, playerMobObj.information.maxHitpoints));
                        }

                    } else {
                        //miss?
                        if (isPlayer) {
                            let socket = playerMobObj.getSocket();
                            modules.helper.helpers.send(socket, "You miss a " + target.name);
                        } else {
                            let socket = playerMobObj.getSocket();
                            modules.helper.helpers.send(socket, target.name + " misses you");
                        }
                    }

                    speed = 3000;
                  
                    let socket = playerMobObj.getSocket();
                    modules.helper.helpers.send(socket, playerMobObj.getPrompt(true));
                    combatRound(playerMobObj, target, speed, isPlayer);

                }, speed);
            }

            combatRound(playerInfo, target, 1000, true);
            combatRound(playerInfo, target, 1200, false);
 

        
        },
        startCombat: function (playerInfo, target, type) {
            //don't allow disconenct if fighting?
            //todo add HP loss
            //add actually hitting
            //add dieing
            
           
        }


    }
    exports.kill = kill;
})(require);