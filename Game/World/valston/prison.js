
/*not sure how to do this yet */
exports.tutorial = {

    rooms: {
        prison: {

            id: 0,
            title: "A dungeon Room\r\n",
            description: "\r\nYou are surrounded by 4 walls covered in grime made of large grey" +
            "stone blocks. The stone floor is cold under your feet." +
            "The only possible way out seems to be the metal gate in" +
            "front of you. A small wooden stool is in" +
            "the corner behind you.\r\n",
            terrain: "city",
            exits:
            {
                n: {
                    name: "North",
                    location: {
                        region: 'Valston',
                        area: 1,
                        areaID: 1
                    },
                    locked: false,
                    hidden: false
                }
            },
            players: []
        }
    }
};

/*not sure how to do this yet */
exports.prison = {

    0: {
        title: "Dungeon Room\r\n",
        description: "\r\nYou are surrounded by 4 walls covered in grime made of large grey" +
        "stone blocks. The stone floor is cold under your feet." +
        "The only possible way out seems to be the metal gate in" +
        "front of you. A small wooden stool is in" +
        "the corner behind you.\r\n",
        terrain: "city",
        exits: {
            n: {
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
        players: []
    },
    1: {
        title: "A hallway Room\r\n",
        description: "\r\nYou are in a dark hallway\r\n",
        terrain: "city",
        exits: {
            s: {
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
