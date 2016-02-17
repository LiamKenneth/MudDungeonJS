(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
    };

    var equipment = function (socket, playerInfo) {

        modules.helper.helpers.send(socket, "You are wearing:");

        var equip = playerInfo.getEquipment();

        var wearing = '';

        wearing += "Floating: " + equip.floating.name + "\n";
        wearing += "Light: " + equip.light.name + "\n";
        wearing += "Head: " + equip.head.name + "\n";
        wearing += "Left ear: " + equip.leftEar.name + "\n";
        wearing += "Right ear: " + equip.rightEar.name + "\n";
        wearing += "Neck: " + equip.neck.name + "\n";
        wearing += "About body: " + equip.aboutBody.name + "\n";
        wearing += "Body: " + equip.body.name + "\n";
        wearing += "Waist: " + equip.waist.name + "\n";
        wearing += "Left sheath: " + equip.leftSheath.name + "\n";
        wearing += "Right sheath: " + equip.rightSheath.name + "\n";
        wearing += "Back: " + equip.back.name + "\n";
        wearing += "Waist: " + equip.waist.name + "\n";
        wearing += "Left wrist: " + equip.leftWrist.name + "\n";
        wearing += "Right wrist: " + equip.rightWrist.name + "\n";
        wearing += "Left hand: " + equip.leftHand.name + "\n";
        wearing += "Right hand: " + equip.rightHand.name + "\n";
        wearing += "Left ring: " + equip.leftRing.name + "\n";
        wearing += "Right ring: " + equip.rightRing.name + "\n";
        wearing += "Legs: " + equip.legs.name + "\n";
        wearing += "Feet: " + equip.feet.name + "\n";
 
        modules.helper.helpers.send(socket, wearing);

    }
    exports.equipment = equipment;
})(require);