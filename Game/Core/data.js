'use strict';

const fs = require('fs');
//const helper = require('./helpers');
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
      if (manualSave) {
          player = player.savePlayer();
         // let socket = player.getSocket();
          fs.writeFileSync(`./Data/${player.name}.json`, JSON.stringify(player));
//helper.send(socket, "The gods take note of your progress.")
      } else {
          fs.writeFileSync(`./Data/${player.name}.json`, JSON.stringify(player));
      }
          
  
  },
};
