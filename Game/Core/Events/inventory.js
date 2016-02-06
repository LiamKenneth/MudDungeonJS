(function (r) {
    "use strict";

    var modules = {
        helper: r('../helpers'),
        data: r('../data').data,
    };

    var inventory = function (socket, playerInfo) {

        modules.helper.helpers.send(socket, "You are carrying:");

        var inv = playerInfo.getInventory();
        var invLength = inv.length;
        var invItems = '';

        if (invLength == 0) {
            invItems = "Nothing.";
        } else {
            for (var i = 0; i < invLength; i++) {
                invItems +=inv[i].name + '\n';
            }
        }


        modules.helper.helpers.send(socket, invItems);

    }
    exports.inventory = inventory;
})(require);