'use strict';

const fs = require('fs');

module.exports = {

  /**
   * @description gets a file from any location
   * @param directory {string}
   * @param fileName {string}
   * @returns {*}
   */
  loadFile(directory, fileName) {
    const dir = directory || `${__dirname}/../../Data/`;

    try {
      return fs.readFileSync(dir + fileName).toString('utf8');
    } catch (e) {
      return false;
    }
  },

  /**
   * @description saves player info to /Data/playerName.json
   * @param player {object} containing player info
   * @param manualSave {boolean}
   */
  savePlayer(player, manualSave) {
    if (manualSave) player.savePlayer();

    fs.writeFile(`./Data/${player.name}.json`, JSON.stringify(player));
  },
};
