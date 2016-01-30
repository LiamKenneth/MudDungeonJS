(function (r) {
    "use strict";

var exits = function (roomExits) {



    var exitObj = new Object;

    exitObj.exits = [];

    if (!!roomExits['North']) {
        exitObj.exits.push('North');
        exitObj.North = {
            region: roomExits.North.location.region,
            area: roomExits.North.location.area,
            areaID: roomExits.North.location.areaID
        };
    }
    if (!!roomExits['East']) {
        exitObj.exits.push('East');
        exitObj.East = {
            region: roomExits.East.location.region,
            area: roomExits.East.location.area,
            areaID: roomExits.East.location.areaID
        };
    }
    if (!!roomExits['South']) {
        exitObj.exits.push('South');
        exitObj.South = {
            region: roomExits.South.location.region,
            area: roomExits.South.location.area,
            areaID: roomExits.South.location.areaID
        };
    }
    if (!!roomExits['West']) {
        exitObj.exits.push('West');
        exitObj.West = {
            region: roomExits.West.location.region,
            area: roomExits.West.location.area,
            areaID: roomExits.West.location.areaID
        };
    }




    return exitObj;

}
    exports.exits = exits;
})(require);