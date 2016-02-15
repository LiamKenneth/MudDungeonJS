"use strict";



var player = function(playerInfo) {
    this.type = 'player';
    this.socket = '';
    this.name = playerInfo.name || '';
    this.keywords = [playerInfo.name, 'self'];
    this.description = playerInfo.description || 'You see nothing special about them';
    this.age = playerInfo.age || 18;
    this.sex = playerInfo.sex || 'Female';
    this.information = {
        level: playerInfo.information.level || 1,
        race: playerInfo.information.race || '',
        class: playerInfo.information.class || '',
        alignment: playerInfo.information.alignment || 'Good',
        alignmentScore: playerInfo.information.alignmentScore || 0,
        experience: playerInfo.information.experience || 0,
        experienceToNextLevel: playerInfo.information.experienceToNextLevel || 0,
        maxHitpoints: playerInfo.information.maxHitpoints || 32,
        hitpoints: playerInfo.information.hitpoints || 32,
        maxMana: playerInfo.information.maxMana || 100,
        mana: playerInfo.information.mana || 100,
        maxMoves: playerInfo.information.maxMoves || 100,
        moves: playerInfo.information.moves || 100,
        stats: {
            strength: playerInfo.information.stats.strength || 0,
            dexterity: playerInfo.information.stats.dexterity || 0,
            constitution: playerInfo.information.stats.constitution || 0,
            intelligence: playerInfo.information.stats.intelligence || 0,
            wisdom: playerInfo.information.stats.wisdom || 0,
            charisma: playerInfo.information.stats.charisma || 0
        }
    };
    this.location = {
        region: playerInfo.location.region || '',
        area: playerInfo.location.area || '',
        areaID: playerInfo.location.areaID || 0,
        coordsY: 0,
        coordsX: 0
    };
    this.password = playerInfo.password;
    this.inventory = playerInfo.inventory || [];
    this.equipment = {
        floating: playerInfo.equipment.floating || "Nothing",
        light: playerInfo.equipment.light || "Nothing",
        head: playerInfo.equipment.head || "Nothing",
        leftEar: playerInfo.equipment.leftEar || "Nothing",
        rightEar: playerInfo.equipment.rightEar || "Nothing",
        neck: playerInfo.equipment.neck || "Nothing",
        cloak: playerInfo.equipment.cloak || "Nothing",
        aboutBody: playerInfo.equipment.aboutBody || "Nothing",
        body: playerInfo.equipment.body || "Nothing",
        waist: playerInfo.equipment.waist || "Nothing",
        leftSheath: playerInfo.equipment.leftSheath || "Nothing",
        rightSheath: playerInfo.equipment.rightSheath || "Nothing",
        back: playerInfo.equipment.back || "Nothing",
        leftWrist: playerInfo.equipment.leftWrist || "Nothing",
        rightWrist: playerInfo.equipment.rightWrist || "Nothing",
        leftHand: playerInfo.equipment.leftHand || "Nothing",
        rightHand: playerInfo.equipment.rightHand || "Nothing",
        leftRing: playerInfo.equipment.leftRing || "Nothing",
        rightRing: playerInfo.equipment.rightRing || "Nothing",
        legs: playerInfo.equipment.legs || "Nothing",
        feet: playerInfo.equipment.feet || "Nothing"
    };
    this.explored = playerInfo.explored || 0;
    this.totalRooms = playerInfo.totalRooms || 0;
    this.questPoints = 0;
    this.gold = playerInfo.gold || 0;
    this.silver = playerInfo.silver || 0;
    this.copper = playerInfo.copper || 0;
    this.hitroll = playerInfo.hitroll || 0;
    this.damroll = playerInfo.damroll || 0;
    this.wimpy = playerInfo.wimpy || 0;
    this.hours = playerInfo.hours || 0;
    this.mkills = playerInfo.mkills || 0;
    this.mDeaths = playerInfo.mDeaths || 0;
    this.pkKills = playerInfo.pkKills || 0;
    this.pkDeaths = playerInfo.pkDeaths || 0;
    this.pkPoints = playerInfo.pkPoints || 0;
    this.weight = playerInfo.weight || 0;
    this.maxWeight = playerInfo.maxWeight || 0;
    this.wimpy = playerInfo.wimpy || 0;
    this.status = playerInfo.status || 0;
    this.channels = {
        gossip: playerInfo.channels.gossip || 1,
        auction: playerInfo.channels.auction || 1,
        ask: playerInfo.channels.ask || 1,
        clan: playerInfo.channels.clan || 1,
        newbie: playerInfo.channels.newbie || 1
    };




    //Get

    this.getPlayerInfo = function () {

        return this;
    };
    this.getInfo = function() {
        return this.information;
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

                if (this.inventory[i] == inventory) {
                    console.log('removed from inventory')
                    this.inventory.splice(i, 1);
                    break;
                }          
            }


        } else {
            console.log('Must insert object to inventory array');
            
        }

    };

    this.setEquipment = function(slot, item) {

        if (slot === 'hand') {
            if (this.equipment.leftHand === 'Nothing') {
                this.equipment['leftHand'] = item;
            } else {
                this.equipment['rightHand'] = item;
            }

        } else {
            this.equipment[slot] = item;
        }

    };

    this.getPrompt = function(showPrompt) {

        if (showPrompt) {
            return "HP: " + this.information.hitpoints + "/" + this.information.maxHitpoints + " Mana: " + this.information.mana + "/" + this.information.maxMana + " Moves: " + this.information.moves + "/" + this.information.maxMoves + " Tnl: " + this.information.experienceToNextLevel;
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
                    "charisma": this.information.stats.charisma
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
            }

            
    }
    return playerJSON;
   
    }




}

exports.player = player;
