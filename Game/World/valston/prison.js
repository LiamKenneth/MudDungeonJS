/*not sure how to do this yet */
exports.prison = {

    0: {
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
        items: [{
            type: 'object',
            keywords: ['wooden', 'stool', 'woo'],
            name: 'Wooden Stool',
            actions: {
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
            keywords: ['sword', 'swo', 'long'],
            name: 'Long Sword',
            actions: {
                "sit": "sit",
                "wield": "wield"
            },
            description: {
                "look": "The sword shines and glows, it looks sharp",
                "exam": "You look closely at a long sword",
                "room": "A long Sword is here"
            }
        }, {
            type: 'object',
            keywords: ['sword', 'swo', 'short'],
            name: 'Short Sword',
            actions: {
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
            keywords: ['mace', 'mac'],
            name: 'Mace',
            actions: {
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
            keywords: ['bow', 'long'],
            name: 'long bow',
            actions: {
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
            items: [{
                type: 'object',
                keywords: ['gold', 'coins'],
                name: 'Gold',
                description: {
                    "look": "You look at gold",
                    "exam": "You look closely at some gold"
                },
                count: 500
            }, {
                type: 'object',
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
        }]
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
        players: []
    }
}