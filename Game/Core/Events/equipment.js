(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data'),
    };

    var equipment = function (socket, playerInfo) {

        modules.helper.helpers.send(socket, "You are wearing:");

        var equip = playerInfo.getEquipment();
        var wearing = '';

        var floating    = equip.floating.name    || equip.floating;
        var light       = equip.light.name       || equip.light;
        var head        = equip.head.name        || equip.head;
        var leftEar     = equip.leftEar.name     || equip.leftEar;
        var rightEar    = equip.rightEar.name    || equip.rightEar;
        var neck        = equip.neck.name        || equip.neck;
        var aboutBody   = equip.aboutBody.name   || equip.aboutBody;
        var body        = equip.body.name        || equip.body;
        var waist       = equip.waist.name       || equip.waist;
        var leftSheath  = equip.leftSheath.name  || equip.leftSheath;
        var rightSheath = equip.rightSheath.name || equip.rightSheath;
        var back        = equip.back.name        || equip.back;
        var leftWrist   = equip.leftWrist.name   || equip.leftWrist;
        var rightWrist  = equip.leftSheath.name  || equip.leftSheath;
        var leftHand    = equip.leftHand.name    || equip.leftHand;
        var rightHand   = equip.rightHand.name   || equip.rightHand;
        var leftRing    = equip.leftRing.name    || equip.leftRing;
        var rightRing   = equip.rightRing.name   || equip.rightRing;
        var legs        = equip.legs.name        || equip.legs;
        var feet        = equip.feet.name        || equip.feet;

        wearing += "Floating     : " + floating + "\n";
        wearing += "Light        : " + light + "\n";
        wearing += "Head         : " + head + "\n";
        wearing += "Left ear     : " + leftEar + "\n";
        wearing += "Right ear    : " + rightEar + "\n";
        wearing += "Neck         : " + neck + "\n";
        wearing += "About body   : " + aboutBody + "\n";
        wearing += "Body         : " + body + "\n";
        wearing += "Waist        : " + waist + "\n";
        wearing += "Left sheath  : " + leftSheath + "\n";
        wearing += "Right sheath : " + rightSheath + "\n";
        wearing += "Back         : " + back + "\n";
        wearing += "Left wrist   : " + leftWrist+ "\n";
        wearing += "Right wrist  : " + rightWrist + "\n";
        wearing += "Left hand    : " + leftHand + "\n";
        wearing += "Right hand   : " + rightHand + "\n";
        wearing += "Left ring    : " + leftRing + "\n";
        wearing += "Right ring   : " + rightRing + "\n";
        wearing += "Legs         : " + legs + "\n";
        wearing += "Feet         : " + feet + "\n";
 
        modules.helper.helpers.send(socket, wearing);

    }
    exports.equipment = equipment;
})(require);