
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
                "exam": "You look closely at the stool and notice a lockpick underneath it"
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
