(function(r) {
  "use strict";

  var modules = {
    fs: r('fs'),
    path: r('path')
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
    savePlayer: function(player) {

      var playerName = player.name;

      try {
        modules.fs.writeFileSync('./Data/' + playerName + '.json', JSON.stringify(player));

      } catch (e) {
        /* istanbul ignore next */
        if (e.code === 'ENOENT') {
          console.log('Unable to save file');
          return 'Unable to save file';
        }
      }
    }
  };
  exports.data = data;
})(require);
