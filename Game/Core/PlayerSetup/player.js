"use strict";



var player = function(playerInfo) {
    this.type = 'player';
    this.socket = '';
    this.name = playerInfo.name;
    this.keywords = [playerInfo.name, 'self'];
    this.description = playerInfo.description;
    this.age = playerInfo.age;
    this.sex = playerInfo.sex;
    this.information = {
        level: playerInfo.information.level,
        race: playerInfo.information.race,
        class: playerInfo.information.class,
        alignment: playerInfo.information.alignment,
        alignmentScore: playerInfo.information.alignmentScore,
        experience: playerInfo.information.experience,
        experienceToNextLevel: playerInfo.information.experienceToNextLevel,
        maxHitpoints: playerInfo.information.maxHitpoints,
        hitpoints: playerInfo.information.hitpoints,
        maxMana: playerInfo.information.maxMana,
        mana: playerInfo.information.mana,
        maxMoves: playerInfo.information.maxMoves,
        moves: playerInfo.information.moves,
        stats: {
            strength: playerInfo.information.stats.strength,
            dexterity: playerInfo.information.stats.dexterity,
            constitution: playerInfo.information.stats.constitution,
            intelligence: playerInfo.information.stats.intelligence,
            wisdom: playerInfo.information.stats.wisdom,
            charisma: playerInfo.information.stats.charisma,
            luck: playerInfo.information.stats.luck
        }
    };
    this.location = {
        region: playerInfo.location.region,
        area: playerInfo.location.area,
        areaID: playerInfo.location.areaID,
        coordsY: 0,
        coordsX: 0
    };
    this.password = playerInfo.password;
    this.inventory = playerInfo.inventory;
    this.equipment = {
        floating: playerInfo.equipment.floating,
        light: playerInfo.equipment.light,
        head: playerInfo.equipment.head,
        leftEar: playerInfo.equipment.leftEar,
        rightEar: playerInfo.equipment.rightEar,
        neck: playerInfo.equipment.neck,
        cloak: playerInfo.equipment.cloak,
        aboutBody: playerInfo.equipment.aboutBody,
        body: playerInfo.equipment.body,
        waist: playerInfo.equipment.waist,
        leftSheath: playerInfo.equipment.leftSheath,
        rightSheath: playerInfo.equipment.rightSheath,
        back: playerInfo.equipment.back,
        leftWrist: playerInfo.equipment.leftWrist,
        rightWrist: playerInfo.equipment.rightWrist,
        leftHand: playerInfo.equipment.leftHand,
        rightHand: playerInfo.equipment.rightHand,
        leftRing: playerInfo.equipment.leftRing,
        rightRing: playerInfo.equipment.rightRing,
        legs: playerInfo.equipment.legs,
        feet: playerInfo.equipment.feet
    };
    this.explored = playerInfo.explored;
    this.totalRooms = playerInfo.totalRooms;
    this.questPoints = 0;
    this.gold = playerInfo.gold;
    this.silver = playerInfo.silver;
    this.copper = playerInfo.copper;
    this.hitroll = playerInfo.hitroll;
    this.damroll = playerInfo.damroll;
    this.wimpy = playerInfo.wimpy;
    this.hours = playerInfo.hours;
    this.mkills = playerInfo.mkills;
    this.mDeaths = playerInfo.mDeaths;
    this.pkKills = playerInfo.pkKills;
    this.pkDeaths = playerInfo.pkDeaths;
    this.pkPoints = playerInfo.pkPoints;
    this.weight = playerInfo.weight;
    this.maxWeight = playerInfo.maxWeight;
    this.wimpy = playerInfo.wimpy;
    this.status = playerInfo.status;
    this.channels = {
        gossip: playerInfo.channels.gossip,
        auction: playerInfo.channels.auction,
        ask: playerInfo.channels.ask,
        clan: playerInfo.channels.clan,
        newbie: playerInfo.channels.newbie
    },
    this.skills = {
        
    },
    this.spells = {
        
    },
    this.actions = {
        container: false
    }

    function skills(playerClass) {

        var classSkill = {
            "fighter": {
                1: {
                   "long sword": {
                       min: 0,
                       max: 97
                   }
                }
            }
          }

        return classSkill[playerClass] || "fighter";
    }




    //Get

    this.getPlayerInfo = function () {

        return this;
    };

    this.getKeywords = function() {
        return this.keywords;
    }

    this.getAge = function() {
        return this.age;
    };

    this.getLevel = function() {
        return this.information.level;
    };

    this.getClass = function() {
        return this.information.class;
    };

    this.getRace = function() {
        return this.information.race;
    };


    this.getName = function() {
        return this.name;
    };
    this.getDescription = function() {
        return this.description;
    };

    this.getEquipment = function () {
        return this.equipment;
    };

    this.getLocation = function() {
        return JSON.stringify(this.location);
    };
    this.getInformation = function() {
        return this.information;
    };
    this.getSocket = function() {
        return this.socket;
    };
    this.getInventory = function() {
        return this.inventory;
    };

    this.getChannels = function () {
        return this.channels;
    };

    this.findEquipment = function () {
        var eq = [];
        //don't bother with hasOwnProperty it's too slow: 500ms processing time on RPi2
        for (var prop in this.equipment) {
            if (this.equipment[prop] !== 'Nothing') {
                eq.push(this.equipment[prop]);
            }
        }
        return eq;
    }

    this.getPrompt = function (showPrompt) {

        if (showPrompt) {
            return "HP: " + this.information.hitpoints + "/" + this.information.maxHitpoints + " Mana: " + this.information.mana + "/" + this.information.maxMana + " Moves: " + this.information.moves + "/" + this.information.maxMoves + " Tnl: " + this.information.experienceToNextLevel;
        }

    };

    //Set
    this.setDescription = function(description) {
        this.description = description;
    };

    this.setSocket = function(socket) {
        this.socket = socket;
    };

    this.setLocation = function(region, area, areaID) {
        this.location.region = region;
        this.location.area = area;
        this.location.areaID = areaID;
    };

    this.setInventory = function(inventory, command) {

        if (typeof inventory === 'object' && command === 'get') {
            this.inventory.push(inventory);
        } else if (typeof inventory === 'object' && command === 'drop') {

            var invLength = this.inventory.length;

            for (var i = 0; i < invLength; i++) {

                if (this.inventory[i] === inventory) {

                    this.inventory.splice(i, 1);
                    break;
                }          
            }


        } else {
            throw new Error ("Must insert object to inventory array");
            
        }

    };

    this.setEquipment = function (item, status) {

        if (status !== 'remove') {

            if (item.slot === 'hand') {
                if (this.equipment.leftHand === 'Nothing') {
                    this.equipment['leftHand'] = item;
                } else {
                    this.equipment['rightHand'] = item;
                }

            } else {
                this.equipment[item.slot] = item;
            }
        } else {
            this.equipment[item.slot] = 'Nothing';
        }

    };


    
  

    this.savePlayer = function () {

        /* 
         * This just feels wrong, needs to be revisited 
         * Tried to convert the data from getPlayerInfo()
         * to JSON but wouldn't work.
         * This is quick dirty hack
         */
        var playerJSON = {
            "socket": "",
            "name": this.name,
            "description": this.description,
            "age": this.age,
            "information": {
                "level": this.information.level,
                "race": this.information.race,
                "class": this.information.class,
                "alignment": this.information.alignment,
                "alignmentScore": this.information.alignmentScore,
                "experience": this.information.experience,
                "experienceToNextLevel": this.information.experienceToNextLevel,
                "maxHitpoints": this.information.maxHitpoints,
                "hitpoints": this.information.hitpoints,
                "maxMana": this.information.maxMana,
                "mana": this.information.mana,
                "stats": {
                    "strength": this.information.stats.strength,
                    "dexterity": this.information.stats.dexterity,
                    "constitution": this.information.stats.constitution,
                    "intelligence": this.information.stats.intelligence,
                    "wisdom": this.information.stats.wisdom,
                    "charisma": this.information.stats.charisma,
                    "luck": this.information.stats.luck
                }
            },
            "location": {
                "region": this.location.region,
                "area": this.location.area,
                "areaID": this.location.areaID,
                "coordsY": this.location.coordsY,
                "coordsX": this.location.coordsX
            },
            "password": this.password,
            "inventory": this.inventory,
            "equipment": {
                "floating": this.equipment.floating,
                "light": this.equipment.light,
                "head": this.equipment.head,
                "leftEar": this.equipment.leftEar,
                "rightEar": this.equipment.rightEar,
                "neck": this.equipment.neck,
                "cloak": this.equipment.cloak,
                "aboutBody": this.equipment.aboutBody,
                "body": this.equipment.body,
                "waist": this.equipment.waist,
                "leftSheath": this.equipment.leftSheath,
                "rightSheath": this.equipment.rightSheath,
                "back": this.equipment.back,
                "leftWrist": this.equipment.leftWrist,
                "rightWrist": this.equipment.rightWrist,
                "leftHand": this.equipment.leftHand,
                "rightHand": this.equipment.rightHand,
                "leftRing": this.equipment.leftRing,
                "rightRing": this.equipment.rightRing,
                "legs": this.equipment.legs,
                "feet": this.equipment.feet
            },
            "explored": this.explored,
            "questPoints": this.questPoints,
            "gold": this.gold,
            "silver": this.silver,
            "copper": this.copper,
            "channels": {
                "gossip": this.channels.gossip,
                "auction": this.channels.auction,
                "ask": this.channels.ask,
                "newbie": this.channels.newbie,
                "clan": this.channels.clan
            },
            actions: {
                "container": false
            }

            
    }
    return playerJSON;
   
    }




}

exports.player = player;
