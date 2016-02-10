(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
    };

    var equipment = function (socket, playerInfo) {

        modules.helper.helpers.send(socket, "You are wearing:");

        var equipment = playerInfo.getEquipment();

        var wearing = '';

        wearing += "Floating: " + equipment.floating + "\n";
        wearing += "Light: " + equipment.light + "\n";
        wearing += "Head: " + equipment.head + "\n";
        wearing += "Left ear: " + equipment.leftEar + "\n";
        wearing += "Right ear: " + equipment.rightEar + "\n";
        wearing += "Neck: " + equipment.neck + "\n";
        wearing += "About body: " + equipment.aboutBody + "\n";
        wearing += "Body: " + equipment.body + "\n";
        wearing += "Waist: " + equipment.waist + "\n";
        wearing += "Left sheath: " + equipment.leftSheath + "\n";
        wearing += "Right sheath: " + equipment.rightSheath + "\n";
        wearing += "Back: " + equipment.back + "\n";
        wearing += "Waist: " + equipment.waist + "\n";
        wearing += "Left wrist: " + equipment.leftWrist + "\n";
        wearing += "Right wrist: " + equipment.rightWrist + "\n";
        wearing += "Left hand: " + equipment.leftHand + "\n";
        wearing += "Right hand: " + equipment.rightHand + "\n";
        wearing += "Left ring: " + equipment.leftRing + "\n";
        wearing += "Right ring: " + equipment.rightRing + "\n";
        wearing += "Legs: " + equipment.legs + "\n";
        wearing += "Feet: " + equipment.feet + "\n";
 
        modules.helper.helpers.send(socket, wearing);

    }
    exports.equipment = equipment;
})(require);