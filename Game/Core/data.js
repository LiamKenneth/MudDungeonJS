(function(r) {
  "use strict";

  var modules = {
    fs: r('fs'),
    path: r('path')
  };

  var dir = {
    data: __dirname + '/../../Data/'
  }

  var data = {
    loadFile: function(fileLocation) {
      try {
        var file = modules.fs.readFileSync(dir.data + fileLocation).toString('utf8');
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
