var log = require("../logger.js")("Util");

module.exports = {
    opt_get: function (opt, idSeq) {
        var path = idSeq.split(".");
        var cur = opt;
        for (var i = 0; i < path.length; i++) {
            if (cur.hasOwnProperty(path[i])) {
                cur = cur[path[i]];
            } else {
                log("Option " + idSeq + " not found.");
                return null;
            }
        }
        return cur;
    },
    add_slashes: function (str) {
        return str.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    },
    constr : function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    },
    arrayObjectIndexOf : function(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
    },
    delay : (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })()
};