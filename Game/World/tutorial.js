(function() {

  /*not sure how to do this yet */
  exports.tutorial = {

    rooms: {
       prison: {

        id: 0,
        title: "A test Room\r\n",
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
            exitId: 1,
            locked: false,
            hidden: false
            }
        },
        location: [0,0,0]
      }
    }
  };

})(require);
