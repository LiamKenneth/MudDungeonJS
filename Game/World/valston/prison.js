/*not sure how to do this yet */
exports.prison = {

    0: {
        clean: false,
        modified: "", /* set date time when player intereacts with the room, see comment in time.js line 204 */
        title: "Dungeon Room",
        description: "You are surrounded by 4 walls covered in grime made of large grey" +
        "stone blocks. The stone floor is cold under your feet." +
        "The only possible way out seems to be the metal gate in" +
        "front of you. A small wooden stool is in" +
        "the corner behind you.",
        keywords: {
            "look gate": "You look at the metal gate which leads north, apart from being the only exit you see nothing special",
            "exam gate": "You look closely at the gate and notice the hinges and lock look weak, maybe you could bash the door down?"
        },
        terrain: "city",
        exits: {
            North: {
                name: "North",
                location: {
                    region: 'valston',
                    area: 'prison',
                    areaID: 1
                },
                locked: false,
                hidden: false

            }
        },
        players: [],
        mobs: [],
        items: [],
        defaults: {
            mobs: [{
                "name": "Large Rat",
                "description": "You see a furry rat",
                "keywords": ['rat'],
                "information": {
                    "level": 2,
                    "race": "Rat",
                    "class": "",
                    "alignment": "Lawful Evil",
                    "alignmentScore": -200,
                    "experience": 0,
                    "experienceToNextLevel": 0,
                    "maxHitpoints": 150,
                    "hitpoints": 5,
                    "maxMana": 0,
                    "mana": 0,
                    "stats": {
                        "strength": 5,
                        "dexterity": 12,
                        "constitution": 4,
                        "intelligence": 2,
                        "wisdom": 2,
                        "charisma": 1
                    }
                },
                "location": {
                    "region": "",
                    "area": "",
                    "areaID": 0,
                    "coordsY": 0,
                    "coordsX": 0
                },
                "password": "",
                "inventory": [],
                "equipment": {
                    "floating": "Nothing",
                    "light": "Nothing",
                    "head": "Nothing",
                    "leftEar": "Nothing",
                    "rightEar": "Nothing",
                    "neck": "Nothing",
                    "cloak": "Nothing",
                    "aboutBody": "Nothing",
                    "body": "Nothing",
                    "waist": "Nothing",
                    "leftSheath": "Nothing",
                    "rightSheath": "Nothing",
                    "back": "Nothing",
                    "leftWrist": "Nothing",
                    "rightWrist": "Nothing",
                    "leftHand": "Nothing",
                    "rightHand": "Nothing",
                    "leftRing": "Nothing",
                    "rightRing": "Nothing",
                    "legs": "Nothing",
                    "feet": "Nothing"
                },

                "gold": 0,
                "silver": 0,
                "copper": 0,

            }],
            items: [{
                type: 'object',
                location: 'room',
                keywords: ['apple', 'app'],
                name: 'Apple',
                actions: {
                    "container": false,
                    "eat": true,
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a small apple pn the floor",
                    "exam": "You look closely at the apple and notice one half has been eaten already",
                    "room": "An apple is on the floor"
                }
            }, {
                type: 'object',
                location: 'room',
                keywords: ['wooden', 'stool', 'woo'],
                name: 'Wooden Stool',
                actions: {
                    "container": false,
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a small wooden stool, maybe you could use it to bash the prison gate down?",
                    "exam": "You look closely at the stool and notice a lockpick underneath it",
                    "room": "An old Wooden stool is in the corner of the room."
                }
            }, {
                type: 'object',
                location: 'room',
                equipable: true,
                slot: "head",
                keywords: ['helm', 'hel', 'helmet'],
                name: 'Helmet',
                actions: {
                    "container": false,
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "The helmet look desc",
                    "exam": "The helmet exam desc",
                    "room": "A helmet is here"
                }
            }, {
                type: 'object',
                location: 'room',
                equipable: true,
                slot: "hand",
                keywords: ['sword', 'swo', 'short'],
                name: 'Short Sword',
                actions: {
                    "container": false,
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a short sword",
                    "exam": "You look closely at a short sword",
                    "room": "A short Sword is here."
                }
            }, {
                type: 'object',
                location: 'room',
                keywords: ['mace', 'mac'],
                name: 'Mace',
                actions: {
                    "container": false,
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a mace",
                    "exam": "You look closely at a mace",
                    "room": "An iron Mace is here."
                }
            }, {
                type: 'object',
                location: 'room',
                keywords: ['bow', 'long'],
                name: 'long bow',
                actions: {
                    "container": false,
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a bow",
                    "exam": "You look closely at a bow",
                    "room": "A long bow is here leaning against the wall"
                }
            }, {
                type: 'object',
                location: 'room',
                keywords: ['colourized', 'whip'],
                name: '{Wcolourized {Rwhip{x',
                actions: {
                    "container": false,
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a {Wcolourized {Rwhip",
                    "exam": "You look closely at a {Wcolourized {Rwhip",
                    "room": "A {Wcolourized {rwhip{x is laying carelessly on the floor"
                }
            }, {
                type: 'object',
                location: 'room',
                keywords: ['chest', 'wooden'],
                name: 'Wooden chest',
                actions: {
                    "container": true,
                    "locked": false
                },
                description: {
                    "look": "You look at a chest",
                    "exam": "You look closely at a chest",
                    "room": "A large chest is in the centre of the room."
                },
                items: [],
                defaults: {
                    items: [{
                        type: 'object',
                        location: 'container',
                        keywords: ['gold', 'coins'],
                        name: 'Gold',
                        description: {
                            "look": "You look at gold",
                            "exam": "You look closely at some gold"
                        },
                        count: 500
                    }, {
                        type: 'object',
                        location: 'container',
                        keywords: ['potion', 'healing'],
                        name: 'Healing Potion',
                        actions: {
                            "quaff": true,
                        },
                        properties: {

                        },
                        description: {
                            "look": "You look at a potion",
                            "exam": "You look closely at a potion",
                        }
                    }]
                }
            }]
        }
    },
    1: {
        title: "A hallway Room",
        description: "You are in a dark hallway",
        terrain: "city",
        exits: {
            South: {
                name: "South",
                location: {
                    region: 'valston',
                    area: 'prison',
                    areaID: 0
                },
                locked: false,
                hidden: false
            }
        },
        players: [],
        mobs:[],
        items: [],
        defaults: {
            mobs: [],
            items:[]
        }
    }
}