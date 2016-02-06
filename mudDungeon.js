(function (r) {

    "use strict";

    var modules = {
        telnet: r('wez-telnet'),
        playerSetup: r('./Game/Core/player-setup').playerSetup,
        player: r('./Game/Core/PlayerSetup/player-manager').playerManager,
    };

    var telnetPort =  4000;
    var WebPort = 4001;

 
    var recursive = function () {
        console.log("Tick!");

        /*
         * Every 45 Seconds update player health, mana, moves
         * Update game clock, weather, other effects,
         * trigger npc scripts?
         * when to reset rooms?
         * when to save world
         */
        setTimeout(recursive, 45000);
    }
    recursive();

    /*
     Create the telnet server
     */

     var telnet = modules.telnet;
     var server = new telnet.Server(function (socket) {
         console.log('telnet someone connected');


         socket.emit('welcome', modules.playerSetup.welcome(socket));

         socket.on('close', function()
         {

             // modules.playerSetup.player.playerManager.removePlayer(socket);
             // modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);

             console.log("telnet Player left");
         });

         socket.on('interrupt', function () {
             socket.write("INTR!");
             // disconnect on CTRL-C!
             socket.end();
         });




     });
     server.listen(telnetPort);

    /*
     Create the web Server
     Temporary code
     */

    var app = require('http').createServer(handler)
    var io = require('socket.io')(app);
    var fs = require('fs');

    app.listen(WebPort);

    function handler (req, res) {
        fs.readFile(__dirname + '/Public/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });
    }

    io.sockets.on('connection', function (socket) {
        console.log('Web user connected');

        socket.emit('welcome', modules.playerSetup.welcome(socket));


        socket.on('disconnect', function () {

          // modules.playerSetup.player.playerManager.removePlayer(socket);
           //modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);

           console.log("Web Player left");

    });



    });

    io.on('disconnect', function()
    {
        console.log("Player left");
    });


})(require);
