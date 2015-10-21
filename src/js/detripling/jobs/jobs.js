/**
 * Singleton worker group creation. Needs to be set once.
 **/

var $ = require("jquery"), plugin_name = require("../../const/general_plugin.js").name, W = require("./worker"), Internal = require("./internal");
var log = require("../../logger")("Job_dist");

var defaults = {
    n_cores: -1,
    worker_path: "./",
    concepts: function () {

    }
};

var Job_distributer = function (opt) {
    this._opt = $.extend(true, {}, defaults, opt);
    var _n_cores = (this._opt.n_cores <= 0) ? navigator.hardwareConcurrency - 1 : this._opt.n_cores;
    if (!_n_cores)
        _n_cores = 0;

    this.workers = [];
    for (var i = 0; i < _n_cores; i++) {
        this.workers.push(new W(this._opt.worker_path + plugin_name + "_worker.js")); // New worker here
    }

    this.internal = new Internal();
};

Job_distributer.prototype.learn = function (id, fn, worker) {
    if (!this.internal.knows(id)) {
        if (worker) {
            for (var i = 0; i < this.workers.length; i++) {
                this.workers[i].learn(id, fn);
            }
        }
        this.internal.learn(id, fn)
    }
};

Job_distributer.prototype.distribute_run = function (run, cb) {
    var that = this;
    run.on("done", function () {
        if (!run.cleaned) {
            run.cleaned = true;
            for (var j = 0; j < that.workers.length; j++) {
                that.workers[j].clear_data_of(run.id);
            }
        }
        log("Detripling done.")
        if (cb)
            cb(run);
    });
    if (run.triples) {

        // start detripling process
        this._distribute_run_help(run, null);
    }
};

Job_distributer.prototype._distribute_run_help = function (run) {
    var that = this;
    if (!run.is_done()) {

        // On main
        if (this.internal.get_state() == "free") {
            var detripler = run.get_next_detripler(false);
            if (detripler) {
                this.internal.run(detripler.id, run, function (r, t, i, d) {
                    return function (result) {
                        i.state = "free";
                        r.set_draft(d, result);
                        t._distribute_run_help(r);
                    }
                }(run, that, this.internal, detripler))
            }
        }

        // On worker
        for (var i = 0; i < this.workers.length; i++) {
            if (this.workers[i].get_state() == "free") {
                var w_detripler = run.get_next_detripler(true);
                if (w_detripler) {
                    var do_on_worker = function (r, t, w, d) {
                        return function () {
                            w.run(d.id,
                                r,
                                function (result) {
                                    w.state = "free";
                                    r.set_draft(d, result);
                                    t._distribute_run_help(r);
                                });
                        }
                    }(run, that, this.workers[i], w_detripler);

                    if (!this.workers[i].has_triples_for(run)) {
                        this.workers[i].set_triples_for(run, do_on_worker);
                    } else {
                        do_on_worker();
                    }
                }
            }
        }
    }
};

Job_distributer.prototype.destroy = function (cb) {
    for (var i = 0; i < this.workers.length; i++) {
        this.workers[i].terminate();
    }
    this.internal = null;
};

var instance = null;

module.exports = {
    get: function () {
        if (!instance)
            instance = new Job_distributer();
        return instance;
    },
    set: function (opt) {
        if (instance)
            instance.destroy();
        instance = new Job_distributer(opt);
    }
};