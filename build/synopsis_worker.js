/**
 * Runner for worker functions
 */

var interaction_interface_id_counter = 0;
var interaction_id_counter = 0;
var fns = {};
var data = {};

var getFunc = function (fStr) {
    var argName = fStr.substring(fStr.indexOf("(") + 1, fStr.indexOf(")"));
    fStr = fStr.substring(fStr.indexOf("{") + 1, fStr.lastIndexOf("}"));
    fStr = fStr.replace(/\\n|\\t/g, ' ').trim();
    fStr = fStr.replace(/\\"/g, '"');
    return new Function(argName, fStr);
};

var Interaction_interface = function (run_id) {
    this.run_id = run_id;
    this.interaction_interface_id = interaction_interface_id_counter++;
};

Interaction_interface.prototype.set_draft = function (id, draft, cb) {
    var interaction_id = interaction_id_counter++;
    self.postMessage({
        cmd: "set_draft",
        detripler_id: id,
        draft: draft,
        interaction_id: interaction_id,
        interaction_interface_id: this.interaction_interface_id,
        run_id: this.run_id
    });
    self.addEventListener(function (t, ta) {
        return function () {
            if (e.data.cmd == "draft_set" && e.data.interaction_interface_id == t && e.data.interaction_id == ta) {
                cb();
                self.removeEventListener(this);
            }
        }
    }(this.interaction_interface_id, interaction_id));
};

Interaction_interface.prototype.get_draft = function (id, cb) {
    var interaction_id = interaction_id_counter++;
    self.postMessage({
        cmd: "get_draft",
        detripler_id: id,
        interaction_id: interaction_id,
        interaction_interface_id: this.interaction_interface_id,
        run_id: this.run_id
    });
    self.addEventListener(function (t, ta) {
        return function () {
            if (e.data.cmd == "draft" && e.data.interaction_interface_id == t && e.data.interaction_id == ta) {
                cb(e.data.draft);
                self.removeEventListener(this);
            }
        }
    }(this.interaction_interface_id, interaction_id));
};

Interaction_interface.prototype.get_concept = function (id, cb) {
    var interaction_id = interaction_id_counter++;
    self.postMessage({
        cmd: "get_concept",
        concept_id: id,
        interaction_id: interaction_id,
        interaction_interface_id: this.interaction_interface_id,
        run_id: this.run_id
    });
    self.addEventListener(function (t, ta) {
        return function () {
            if (e.data.cmd == "concept" && e.data.interaction_interface_id == t && e.data.interaction_id == ta) {
                cb(e.data.concept);
                self.removeEventListener(this);
            }
        }
    }(this.interaction_interface_id, interaction_id));
};

var add_function = function (fn_id, fn) {
    fns[fn_id] = getFunc(fn);
};

var run_function = function (fn_id, run_id, worker_run_id, params) {
    if (fns[fn_id]) {
        fns[fn_id](data[run_id], new Interaction_interface(run_id), function (f, r, w, s) {
            return function (results) {
                self.postMessage({cmd: "done", id: f, run_id: r, worker_run_id: w, results: results});
            }
        }(fn_id, run_id, worker_run_id), params);
    } else {
        console.log("Function " + fn_id + " not defined.")
    }
};

var set_triples = function (run_id, triples) {
    data[run_id] = JSON.parse(triples);
};

self.addEventListener('message', function (e) {
    switch (e.data.cmd) {
        case "learn":
            add_function(e.data.fn_id, e.data.fn);
            break;
        case "run" :
            run_function(e.data.fn_id, e.data.run_id, e.data.worker_run_id, e.data.params);
            break;
        case "set" :
            set_triples(e.data.run_id, e.data.triples);
            break;
        case "clear" :
            delete data[e.data.run_id];
            break;
    }
});