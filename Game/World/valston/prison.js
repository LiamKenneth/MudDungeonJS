(function() {

  /*not sure how to do this yet */
  exports.prison = [{
        id: 0,
        title: "A test Room\r\n",
        description: "\r\nYou are surrounded by 4 walls covered in grime made of large grey" +
          "stone blocks. The stone floor is cold under your feet." +
          "The only possible way out seems to be the metal gate in" +
          "front of you. A small wooden stool is in" +
          "the corner behind you.\r\n",
        terrain: "city",
        exits: {"n": 1},
        location: {
          region: 'valston',
          area: 'prison',
          areaId: 0,
          coordsY: 0,
          coordsX:0
        },
        players: []

      },
      {
       id: 1,
       title: "A hallway\r\n",
       description: "\r\nYou have entered in to a hallway",
       terrain: "city",
       exits: {"s": 0},
       location: {
         region: 'valston',
         area: 'prison',
         areaId: 1,
         coordsY: 1,
         coordsX:0
       }

     }]

})(require);
