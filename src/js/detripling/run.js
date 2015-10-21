var log = require("./../logger")("Detripler_run"), e_ext = require("../util/event_obj_extender");

var run_id_counter = 0;

var Detripling_run = function (triples, concepts, structure) {
    this.triples = triples;
    this.concepts = concepts;
    this.structure = structure;
    this.id = run_id_counter++;
    this.d_keys = structure.d_keys.slice();
    this._detripler_done_history = {"_": true};
    this.results = {};
    return e_ext(this);
};

Detripling_run.prototype.get_next_detripler = function (worker_flag) {
    var next = null;
    for (var n = 0; (n < this.d_keys.length) && (next == null); n++) {
        var t = this.structure.cy.$("#" + this.d_keys[n]), parents_ready = true, parents = t.incomers("node");
        for (var j = 0; ((j < parents.length) && parents_ready); j++) {
            var p_id = parents[j].id();
            if (this._detripler_done_history[p_id] == undefined) {
                parents_ready = false;
            }
        }

        // Only get fitting detripler. Does it need to be computable on workers? Are the parents done?
        if (parents_ready && (!worker_flag || this.structure.detriplers[this.d_keys[n]].worker)) {
            next = this.d_keys[n];
            this.d_keys.splice(n, 1);
        }
    }
    return this.structure.detriplers[next];
};

Detripling_run.prototype.set_draft = function (detripler, draft) {
    this.results[detripler.id] = draft;
    this._detripler_done_history[detripler.id] = true;
    if(this.is_done()) {
        this.trigger("done");
    }
};

Detripling_run.prototype.modify_draft = function (id, draft) {
    this.results[id] = draft;
    this._detripler_done_history[id] = true;
    if(this.is_done()) {
        this.trigger("done");
    }
};

Detripling_run.prototype.get_draft = function (id) {
    if (this.results[id]) {
        return this.results[id];
    } else {
        log("No draft for " + id + " found.");
        return null;
    }
};

Detripling_run.prototype.get_concept = function (id) {
    if (this.concepts[id]) {
        return this.concepts[id];
    } else {
        log("No concept for " + id + " found.");
        return [];
    }
};

Detripling_run.prototype.is_done = function () {
    return Object.keys(this._detripler_done_history).length == this.structure.d_keys.length + 1;
};

module.exports = Detripling_run;