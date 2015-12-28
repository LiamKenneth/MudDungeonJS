"use strict";

var player = function(playerInfo) {
    this.socket = '';
    this.name = playerInfo.name || '';
    this.description = playerInfo.description || 'You see nothing special about them';
    this.age = playerInfo.age || 18;
    this.information = {
        level: playerInfo.level || 1,
        race: playerInfo.race || '',
        class: playerInfo.class || '',
        alignment: playerInfo.alignment || '',
        alignmentScore: 0,
        experience: 0,
        experienceToNextLevel: 0,
        maxHitpoints: 0,
        hitpoints: 0,
        maxMana: 0,
        mana: 0,
        stats: {
            strength: playerInfo.stats.str || 0,
            dexterity: playerInfo.stats.dex || 0,
            constitution: playerInfo.stats.con || 0,
            intelligence: playerInfo.stats.int || 0,
            wisdom: playerInfo.stats.wis || 0,
            charisma: playerInfo.stats.cha || 0
        }
    };
    this.location = {
        region: playerInfo.location.region || '',
        area: playerInfo.location.area || '',
        areaID: 0,
        coordsY: 0,
        coordsX: 0
    };
    this.password = playerInfo.password;
    this.inventory = {};
    this.equipment = {};
    this.explored = 0;
    this.questPoints = 0;
    this.gold = 0;
    this.silver = 0;
    this.copper = 0;

    //Get
    this.getInfo = function() {
        return JSON.stringify(player);
    };

    this.getName = function() {
        return this.name;
    };
    this.getDescription = function() {
        return this.description;
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

    //Set
    this.setDescription = function(description) {
        this.description = description;
    };

    this.setSocket = function(socket) {
        this.socket = socket;
    };



}

exports.player = player;