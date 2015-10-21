var log = require("./../logger")("Detripler_manager"), Structure = require("./structure"), Jobs = require("./jobs/jobs"), Run = require("./run");
var detriplers = require("./detriplers.js"), Base_detripler = require("./scheme");

var defaults = {
    detriplers: detriplers
    //jobs: {}
};

var Manager = function (opt) {
    this._opt = $.extend(true, {}, defaults, opt);
    if (this._opt.jobs)
        Jobs.set(this._opt.jobs);
    this.jobs = Jobs.get();
    var keys = Object.keys(this._opt.detriplers);
    for (var i = 0; i < keys.length; i++) {
        var detripler = this._opt.detriplers[keys[i]];
        if (!detripler.derived_from_base) {
            detripler = this._opt.detriplers[keys[i]] = $.extend(true, new Base_detripler(keys[i]), detripler);
        }
        this.jobs.learn(detripler.id, detripler.fn, detripler.worker);
    }
    this.structure = new Structure(this._opt.detriplers);
};

Manager.prototype.detriple = function (triples, concepts, structure, cb) {
    if (!structure)
        structure = this.structure;
    var run = new Run(triples, concepts, structure), that = this;
    this.jobs.distribute_run(run, cb);
    return run;
};

Manager.prototype.get_detriplers = function () {
    return this._opt.detriplers;
};

module.exports = Manager;