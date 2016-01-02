(function(r) {
  "use strict";

  var modules = {
    helper: r('./helpers').helpers
  };


  var commands = {
    yes: function(string) {
      return string.toLowerCase().match(/^(y|yes|yea|yeah|sure|fine|okay|aye|yep|ok)$/)
    },
    no: function(string) {
      return string.toLowerCase().match(/^(n|no|never|nah|nay)$/)
    },
    look:function(string) {
      return string.toLowerCase().match(/^(l|look|loo)$/)
    },
    move: function(string) {

    },
    parseInput: function(pc) {
      var socket = pc.getSocket();
      var regex =  '/^(.*[1-9a-z]{2})[ a-z]+/i';

      socket.on('data', function(input)
      {

        var str = input.toString().toLowerCase();

        /* commands player status (standing/resting/fighting)

        misc
        -------
        Game (display game options double xp etc)
        Who
          who xxx


        communication
        -------------
        gtell
        tell player
        -reply
        say / '
          - say to player
        Yell / shout
        Whisper to player
        emote
        pose

        Channels
        --------
        Auction
        Newbie
        Ask / answer
        Pray
        ooc
        Clan/Kingdom Chat

        Movement
        --------
        North / East / south / west / up / down

        Character
        ----------
        Inventory
        Score
        Save
        Quit
        description + xxx
        description -
        description show
        description save
        description format
        name xxx
        config
          -no loot
          -no summon
        equipment
        title xxx
        wimpy xxx (flee when hp gets to xxx)

        Info / help
        ---------
        commands
        socials
        idea xxx
        bug xxx
        report xxx
         time
         weather


        Actions
        -------
        Give xxx to xxx
        list
        Buy xxx
        Sell xxx
        inspect xxx
        Appraise xxx
        sit
        rest
        sleep
        examine xxx
        look
          - look all
          - look xxx
        exits
        where
        areas
        recall
        read xxx
        wield xxx
        remove
          - remove all
          - remove xxx
        wear
          - wear all
          - wear xxx
        zap xxx
        lore xxx / value xxx
        hold xxx
        fill xxx
        drink xxx
        quaff xxx
        eat xxx
        lock xxx
        unlock xxx
        open xxx
        close xxx
        get xxx
          - get xxx from xxx
        drop xxx
        put xxx in xxx
        put xxx on xxx
        Brandish
        follow xxx
        group xxx
        steal xxx
        peak xxx
        wake
        train xxx
        practice xxx
        explored


        Writing
        -------
         dip quill in xxx (ink / blood)
         write -
          write parchment
          write book
            - Write book title xxx
            - Write xxx page 1



        Combat
        ------------
        consider xxx
        kill xxx
        murder xxx
        flee (optional direction)

        imm commands
        -------------------
        Ban xxx
        disconnect xxx
        reboot xxx
        goto xxx
        invis
        mFind xxx
        MWhere xxx
        MScore xxx
        CFind xxx
        immtalk xxx





         */


        switch (true) {

          case /\bn(?!\w)|n(orth|ort|or|o)(?!\w)/i.test(str):
            console.log('North')
            break;
          case /\be(?!\w)|e(ast|as|a)(?!\w)/i.test(str):
            console.log('east')
            break;
          case /\bs(?!\w)|s(outh|out|ou|o)(?!\w)/i.test(str):
            console.log('south')
            break;
          case /\bw(?!\w)|w(est|es|e)(?!\w)/i.test(str):
            console.log('west')
            break;
          case /\bu(?!\w)|u(p)(?!\w)/i.test(str):
            console.log('up')
            break;
            case /\bd(?!\w)|d(own)(?!\w)/i.test(str):
            console.log('down')
            break;
          case str.match(/^(l|lo|loo|look)$/):
            console.log('look')
            break;
          case str.match(/^(i|in|inv|inve|inven|invent|invento|inventor|inventory)$/):
            console.log('inventory')
            break;
          default:
            console.log(str + " • Didn't match any test");
            break;
        }

      });

      // check if input is prefixed


      var move = {
        north: ''
      }
    }
  };
  exports.commands = commands;
})(require);
