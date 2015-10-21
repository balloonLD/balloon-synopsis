/**
* Extends an object with backbone events and switching. A switch is a event which is triggered once and stays "on". If a function gets bond to a switch in on state it is invoked instantly.
**/

var Backbone = require("backbone"), $ = require("jquery");

module.exports = function(obj) {
    obj = $.extend(obj, Backbone.Events);
    if (!obj._saved_switches) {
        obj._saved_switches = {};
    }
    obj.on_switch = function(event, callback, context) {
        if(obj._saved_switches[event]) {
            callback();
        } else {
            obj.once("switch:" + event, callback, context)
        }
    };
    obj.trigger_switch = function(event) {
        obj._saved_switches[event] = true;
        obj.trigger("switch:" + event)
    };
    return obj;
};