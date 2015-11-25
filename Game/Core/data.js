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
    }
  };
exports.data = data;
})(require);
