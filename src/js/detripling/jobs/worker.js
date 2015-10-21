/**
 * Worker
 **/
var e_ext = require("../../util/event_obj_extender");

var stringify = function (obj) {
    return JSON.stringify(obj, function (k, v) {
        if (typeof v == "function") {
            return v.toString();
        } else {
            return v;
        }
    });
};

var worker_run_id_counter = 0;

var Worker_wrap = function (path) {
    this.state = "free";
    this.worker = new Worker(path);
    this.triple_history = {};
    return e_ext(this);
};

Worker_wrap.prototype.set_triples_for = function (run, cb) {
    this.triple_history[run.id] = true;
    this.worker.postMessage({cmd: 'set', run_id: run.id, triples: stringify(run.triples)});
    if (cb)
        cb();
};

Worker_wrap.prototype.learn = function (fn_id, fn) {
    this.worker.postMessage({cmd: 'learn', fn_id: fn_id, fn: stringify(fn)});
};

Worker_wrap.prototype.run = function (fn_id, run, cb) {
    if (this.state == "free") {
        this.state = "occupied";
        var worker_run_id = worker_run_id_counter++;
        var that = this;
        this.worker.addEventListener('message', function (w_r_id, r) {
            return function (e) {
                if (e.data.worker_run_id == w_r_id) {
                    switch (e.data.cmd) {
                        case "get_concept":
                            that.worker.postMessage({cmd: 'concept', concept: r.get_concept(e.data.concept_id)});
                            break;
                        case "get_draft":
                            that.worker.postMessage({cmd: 'draft', draft: r.get_draft(e.data.detripler_id)});
                            break;
                        case "set_draft":
                            that.worker.postMessage({cmd: 'draft_set', draft: r.modify_draft(e.data.detripler_id, e.data.draft)});
                            break;
                        case "done":
                            var parsed_results = e.data.results ? e.data.results : null;
                            cb(parsed_results);
                            that.worker.removeEventListener(this);
                            break;
                        default:
                            break;
                    }
                }
            }
        }(worker_run_id, run));
        this.worker.postMessage({cmd: 'run', fn_id: fn_id, run_id: run.id, worker_run_id: worker_run_id});
    }
};

Worker_wrap.prototype.get_state = function () {
    return this.state;
};

Worker_wrap.prototype.has_triples_for = function (run) {
    return this.triple_history.hasOwnProperty(run.id);
};

Worker_wrap.prototype.clear_data_of = function (run) {
    this.worker.postMessage({cmd: 'clear', run_id: run.id});
    delete this.triple_history[run.id];
};

module.exports = Worker_wrap;