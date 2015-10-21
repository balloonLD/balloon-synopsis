/**
 * Worker
 **/

var stringify = function (obj) {
    return JSON.stringify(obj, function (k, v) {
        if (typeof v == "function") {
            return v.toString();
        } else {
            return v;
        }
    });
};

// Transport object
var Local_interaction_interface = function(run) {
    this.run = run;
};

Local_interaction_interface.prototype.get_draft = function (id, cb) {
    cb(this.run.get_draft(id).slice());
};

Local_interaction_interface.prototype.get_concept = function (id, cb) {
    cb(this.run.get_concept(id).slice());
};

Local_interaction_interface.prototype.set_draft = function (id, draft, cb) {
    cb(this.run.modify_draft(id, draft));
};

var Internal = function () {
    this.state = "free";
    this.fns = {};
};

Internal.prototype.learn = function (id ,fn) {
    // Todo learn
    this.fns[id] = fn;
};

Internal.prototype.run = function (id, run, cb) {
    if (this.state == "free") {
        this.state = "occupied";
        this.fns[id](run.triples, new Local_interaction_interface(run), function(results) {
            cb(results);
        });
    }
};

Internal.prototype.knows = function (id) {
    return this.fns.hasOwnProperty(id);
};

Internal.prototype.get_state = function () {
    return this.state;
};

module.exports = Internal;