var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "multi.named";

var Detripler = function () {
        Base_detripler.call(this, ID);
        this.worker = true;
        this.parents = ["incoming.named", "outgoing.named"];
        this.template_id = "tiles.multi.named";
        this.fn = function (triples, transport, cb) {
            var draft = [], tmp = {};

            // get incoming draft and search for same subjects
            var inc_draft;
            transport.get_draft("incoming.named", function (inc_named) {
                inc_draft = inc_named;
                for (var i = 0; i < inc_named.length; i++) {
                    var inc_triple = inc_named[i].triple;
                    if (!tmp[inc_triple.subject.nominalValue]) {
                        tmp[inc_triple.subject.nominalValue] = {
                            inc: [{triple: inc_triple, index: i}],
                            out: []
                        };
                        tmp[inc_triple.subject.nominalValue].length = 1;
                    } else {
                        tmp[inc_triple.subject.nominalValue].inc.push({triple: inc_triple, index: i});
                        tmp[inc_triple.subject.nominalValue].length++;
                    }
                }
            });

            // get outgoing draft and search for same objects
            var out_draft;
            transport.get_draft("outgoing.named", function (out_named) {
                out_draft = out_named;
                for (var i = 0; i < out_named.length; i++) {
                    var out_triple = out_named[i].triple;
                    if (!tmp[out_triple.object.nominalValue]) {
                        tmp[out_triple.object.nominalValue] = {
                            inc: [],
                            out: [{triple: out_triple, index: i}]
                        };
                        tmp[out_triple.object.nominalValue].length = 1;
                    } else {
                        tmp[out_triple.object.nominalValue].out.push({triple: out_triple, index: i});
                        tmp[out_triple.object.nominalValue].length++;
                    }
                }
            });

            // Modify flags
            var inc_draft_delete_indexes = [], out_draft_delete_indexes = [];
            var found_targets = Object.keys(tmp);
            for (var i = 0; i < found_targets.length; i++) {
                if(tmp[found_targets[i]].length > 1) {
                    var draft_triples = {out: [], inc: []}, draft_resource = null;
                    var inc_data = tmp[found_targets[i]].inc;
                    for (var j = 0; j < inc_data.length; j++) {
                        if (!draft_resource)
                            draft_resource = inc_data[j].triple.subject;
                        draft_triples.inc.push(inc_data[j].triple);
                        inc_draft_delete_indexes.push(inc_data[j].index);
                    }
                    var out_data = tmp[found_targets[i]].out;
                    for (var k = 0; k < out_data.length; k++) {
                        if (!draft_resource)
                            draft_resource = out_data[j].triple.object;
                        draft_triples.out.push(out_data[k].triple);
                        out_draft_delete_indexes.push(out_data[k].index);
                    }

                    // add to final draft
                    draft.push({resource: draft_resource, triples: draft_triples});
                }
            }

            if (inc_draft_delete_indexes.length > 0 || out_draft_delete_indexes.length > 0) {
                // Modify drafts
                var wait_for_n_mods = 0;
                if (inc_draft_delete_indexes.length > 0)
                    wait_for_n_mods++;
                if (out_draft_delete_indexes.length > 0)
                    wait_for_n_mods++;
                var mods_done = 0;
                if (inc_draft_delete_indexes.length > 0)
                    inc_draft_delete_indexes.sort(function(a, b) {return a-b;});
                while (inc_draft_delete_indexes.length > 0) {
                    var index = inc_draft_delete_indexes.pop();
                    inc_draft.splice(index, 1);
                }
                transport.set_draft("incoming.named", inc_draft, function () {
                    mods_done++;
                    if (mods_done == wait_for_n_mods)
                        cb(draft);
                });
                if (out_draft_delete_indexes.length > 0)
                    out_draft_delete_indexes.sort();
                while (out_draft_delete_indexes.length > 0) {
                    var index = out_draft_delete_indexes.pop();
                    out_draft.splice(index, 1);
                }
                transport.set_draft("outgoing.named", out_draft, function () {
                    mods_done++;
                    if (mods_done == wait_for_n_mods)
                        cb(draft);
                });
            } else {
                cb([]);
            }
        };

    }
    ;

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;