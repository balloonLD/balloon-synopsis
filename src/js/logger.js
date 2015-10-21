/**
 * Wrapper for logger creation
 **/

require("bows");
var plugin_prefix = require("./const/general_plugin.js").prefix;

var loggers = {};

module.exports = function (str) {
    var id;
    if (str) {
        id = plugin_prefix + str;
    } else {
        id = plugin_prefix;
    }
    if (!loggers[id]) {
        loggers[id] = bows(id);
    }
    return loggers[id];
};