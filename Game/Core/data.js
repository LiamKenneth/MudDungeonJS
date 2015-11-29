(function(r) {
  "use strict";

  var modules = {
    fs:r('fs'),
    path:r('path')
  };

  var dir = {
    data: __dirname + '/../../Data/'
  }

  var data = {
    loadMotd: function(motdLocation) {
      return modules.fs.readFileSync(dir.data + motdLocation).toString('utf8');
    },
    savePlayer: function(player) {

      var playerName =  player.name;

        modules.fs.writeFile('./Data/' + playerName + '.json', JSON.stringify(player), function (err) {
          if (err) {
            return console.log(err.message);
          }
        });
    }
  };
exports.data = data;
})(require);
