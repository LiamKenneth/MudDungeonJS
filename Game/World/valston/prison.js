
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
        },
            {
                keywords: ['sword', 'swo', 'long'],
                name: 'Long Sword',
                actions: {
                    "sit": "sit",
                    "wield": "wield"
                },
                description: {
                    "look": "You look at a long sword",
                    "exam": "You look closely at a long sword",
                    "room": "A long Sword is here"
                }
            },
            {
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
            },
            {
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
            },
            {
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
            }]
    },
    1: {
        title: "A hallway Room",
        description: "You are in a dark hallway",
        terrain: "city",
        exits: {
            South:{
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
