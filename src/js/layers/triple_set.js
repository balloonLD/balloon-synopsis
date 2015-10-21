var e_ext = require("../util/event_obj_extender");

var Triple_set = function () {
    this.val = [];
    return e_ext(this)
};

Triple_set.prototype.add = function (triple) {
    if (triple instanceof Array) {
        this.val = this.val.concat(triple);
    } else {
        this.val.push(triple);
    }
    this.trigger("updated", this.val, triple);
};


Triple_set.prototype.get = function (index) {
    if (!index) {
        return this.val;
    } else {
        return this.val[index];
    }
};

Triple_set.prototype.clear = function (index) {
    this.val = [];
};

module.exports = Triple_set;