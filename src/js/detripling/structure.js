var log = require("./../logger")("Detripler_structure"), cytoscape = require("cytoscape");

var Structure = function (detriplers) {

    this.detriplers = detriplers;

    // Relation graph of detriplers
    this._rendered_graph = $("<div style='height: 100%; width: 100%'><div style='height: 100%; width: 100%'></div></div>");
    this.cy = cytoscape({
        container: this._rendered_graph.children()[0],
        layout: {
            name: 'breadthfirst',
            directed: true
        },
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'red',
                    'content': 'data(id)'
                }
            }
        ]
    });
    this.cy.add({group: "nodes", data: {id: "_"}});
    this.d_keys = Object.keys(detriplers);
    for (var i = 0; i < this.d_keys.length; i++) {
        this._insert_in_graph(detriplers[this.d_keys[i]]);
    }
};

Structure.prototype.add_detripler = function (detripler) {
    if (!this.detriplers[detripler.id])
        this.detriplers[detripler.id] = detripler;
    this.d_keys.push(detripler.id);
    this._insert_parent_in_graph(detripler);
};

Structure.prototype._insert_in_graph = function (detripler) {
    var cy_data = [];
    if (!detripler.parents.length > 0)
        cy_data.push({
            group: "edges",
            data: {id: "_" + detripler.id, label: detripler.id, source: "_", target: detripler.id}
        });
    for (var i = 0; i < detripler.parents.length; i++) {
        var pre_detripler = this.detriplers[detripler.parents[i]];
        var e_id = pre_detripler.id + ":" + detripler.id;
        cy_data.push({group: "edges", data: {id: e_id, source: pre_detripler.id, target: detripler.id}});
    }
    cy_data.push({group: "nodes", data: {id: detripler.id}});
    this.cy.add(cy_data);
};

Structure.prototype.paint_dependencies_on = function (ele) {
    this._rendered_graph.detach();
    $(ele).append(this._rendered_graph);
    this.cy.resize();
    this.cy.fit();
};

//Structure.prototype.get_schedule = function () {
//    var done_nodes = {"_": -1}, detriplers = this.d_keys.slice(), len = detriplers.length;
//
//    if (this.schedule && this.d_keys.length == this.schedule_elements_number)
//        return this.schedule;
//
//    // ASAP algorithm
//    do {
//        for (var n = 0; n < detriplers.length; n++) {
//            var t = this.cy.$("#" + detriplers[n]), parents_ready = true, schedule_on = -1, parents = t.incomers("node");
//            for (var j = 0; ((j < parents.length) && parents_ready); j++) {
//                var p_id = parents[j].id();
//                if (done_nodes[p_id] == undefined) {
//                    parents_ready = false;
//                } else {
//                    schedule_on = Math.max(schedule_on, done_nodes[p_id])
//                }
//            }
//            if (parents_ready) {
//                done_nodes[t.id()] = schedule_on + 1;
//                detriplers.splice(n, 1);
//            }
//        }
//        if (detriplers.length == len) {
//            if (len == 0)
//                break;
//            log("Error in detripler dependencies.");
//            break;
//        } else {
//            len = detriplers.length;
//        }
//    } while (true);
//
//    // Write schedule
//    var schedule = [];
//    for (var i = 0; i < this.d_keys.length; i++) {
//        if (!schedule[done_nodes[this.d_keys[i]]])
//            schedule[done_nodes[this.d_keys[i]]] = [];
//        schedule[done_nodes[this.d_keys[i]]].push(this.d_keys[i]);
//    }
//    this.schedule_levels = done_nodes;
//    this.schedule_elements_number = this.d_keys.length;
//    this.schedule = schedule;
//    return schedule;
//};

module.exports = Structure;