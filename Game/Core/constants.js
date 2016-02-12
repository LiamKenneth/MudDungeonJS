(function (r) {
    "use strict";

    function define(name, value) {
        Object.defineProperty(exports, name, {
            value: value,
            enumerable: true
        });
    }

    // Channel unique IDs
    define("channel_gossip", 0);
    define("channel_newbie", 1);
    define("channel_clan", 2);
    define("channel_auction", 3);
    define("channel_ask", 4);
})(require);
