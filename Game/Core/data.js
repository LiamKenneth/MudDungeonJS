(function(r) {
  "use strict";

  var modules = {
    fs: r('fs'),
    path: r('path'),
   // helper: r('./helpers').helpers
  };

  var dataDir = {
    data: __dirname + '/../../Data/'
  }

  var data = {
    loadFile: function(directory, fileLocation) {

      var dir = directory || dataDir.data;

      try {
        var file = modules.fs.readFileSync(dir + fileLocation).toString('utf8');
        return file;
      }
      catch (e) {
        console.log(e.message )
        return false;
      }
    },
    savePlayer: function (player, manualSave) {
        //   var playerSocket = player.getSocket();

        if (manualSave) {
            player = player.savePlayer();
        }
        

      //  modules.helper.send(playerSocket, "Saving Player...");

        modules.fs.writeFile('./Data/' + player.name + '.json', JSON.stringify(player), function (err) {
            if (err) {
             //   modules.helper.helpers.send(playerSocket, "Something went wrong saving, Please inform an Immortal");
                console.log(err);
            }

            if (manualSave) {
               // modules.helper.helpers.send(playerSocket, "Player saved, saving is automatic when you leave the game.");
                console.log('PLAYER SAVED');
            }
        });

    }
  };
  exports.data = data;
})(require);
