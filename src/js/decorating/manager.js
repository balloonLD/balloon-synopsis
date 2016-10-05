var log = require("./../logger")("Decorator_manager");

var decorators = require("./decorators.js");

var defaults = {
    decorators: decorators
};

var Manager = function (opt, synopsis) {
    this.synopsis = synopsis;
    this._opt = $.extend(true, {}, defaults, opt);
    var decorator_keys = Object.keys(defaults.decorators);
    if (opt.decorators)
        for (var i = 0; i < decorator_keys.length; i++) {
            if (opt.decorators[decorator_keys[i]])
                this._opt.decorators[decorator_keys[i]] = $.extend(true, {}, defaults.decorators[decorator_keys[i]], opt.decorators[decorator_keys[i]]);
        }
};

Manager.prototype.decorate = function (divs, cb) {
    for (var i = 0; i < this._opt.decorators.keys_for_decorators.length; i++) {
        divs = this._opt.decorators[this._opt.decorators.keys_for_decorators[i]].decorate(divs, synopsis, this._opt.decorators[this._opt.decorators.keys_for_decorators[i]].config);
    }
    if (cb)
        cb(divs);
    return divs;
};

module.exports = Manager;