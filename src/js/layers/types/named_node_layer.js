/**
 * Layer
 **/

var CSS = require("../../const/css"), store_wrap = require("../../store").get(), templating = require("../../templating"), log = require("../../logger.js")("Layer_Named");
var info = require('../../info');
var Layer = require('../layer');

var Named_node_layer = function (detripling, decorating, msg, node, opt) {
    Layer.call(this, detripling, decorating, msg, opt);
    this.id = node.nominalValue;
    this.node = node;
    var that = this;

    this.get_concepts = function (triples) {
        var concepts = {incoming: [], outgoing: []};
        for (var i = 0; i < triples.length; i++) {
            if (triples[i].subject == that.node.nominalValue) {
                if (!concepts[triples[i].object.interfaceName]) {
                    concepts[triples[i].object.interfaceName] = [];
                    concepts["outgoing." + triples[i].object.interfaceName] = [];
                    concepts["incoming." + triples[i].object.interfaceName] = [];
                }
                concepts[triples[i].object.interfaceName].push(i);
                concepts["outgoing." + triples[i].object.interfaceName].push(i);
                concepts["outgoing"].push(i);
            } else {
                if (!concepts[triples[i].subject.interfaceName]) {
                    concepts[triples[i].subject.interfaceName] = [];
                    concepts["outgoing." + triples[i].subject.interfaceName] = [];
                    concepts["incoming." + triples[i].subject.interfaceName] = [];
                }
                concepts[triples[i].subject.interfaceName].push(i);
                concepts["incoming." + triples[i].subject.interfaceName].push(i);
                concepts["incoming"].push(i);
            }
        }
        return concepts;
    };

    // Store observing
    //store.startObservingNode.call(store_wrap.store, node.nominalValue, function (node_env) {
    //    log(node_env);
    //});
    store_wrap.store.subscribe.call(store_wrap.store, node.nominalValue, null, null, null, function (event, triples) {
        that.triples.add(triples);
    });
    store_wrap.store.subscribe.call(store_wrap.store, null, null, node.nominalValue, null, function (event, triples) {
        that.triples.add(triples);
    });

    // On new triples
    that.triples.on("updated", function (triples, new_triples) {
        log("Got new triples", [triples]);
        that.tileify(triples);
    });
    this.label = node.nominalValue; // TODO get label
    this.label_small = node.nominalValue;
};

Named_node_layer.prototype = Object.create(Layer.prototype);
Named_node_layer.prototype.constructor = Named_node_layer;

Named_node_layer.prototype.load_remote = function () {
    var that = this;
    this.trigger("request_remote", ['SELECT DISTINCT ?s ?p ?o where {{?s ?p ?o. VALUES ?s {<' + this.node.nominalValue + '>}} UNION {?s ?p ?o. VALUES ?o {<' + this.node.nominalValue + '>}}} ORDER BY ?s'], function (resp, b, remote_num, partial) {
        var graph = store_wrap.store.parser.parse_to_graph(resp.results.bindings, ["s", "p", "o"]);
        that.triples.add(graph.triples);
        if (partial) {
            b.do_partial_progress(remote_num);
        } else {
            b.do_progress(remote_num);
        }
        //store_wrap.store.insert_triples(resp.results.bindings, null, function () {
        //    if (partial) {
        //        b.do_partial_progress(remote_num);
        //        that.log("insert done");
        //    } else {
        //        b.do_progress(remote_num);
        //    }
        //});
    });
};

Named_node_layer.prototype.load_local = function () {
    var that = this, triples = [], cnt = 0;

    var prepare_triples = function (results) {
        cnt++;
        if (triples) {
            triples = triples.concat(results.triples);
        }
        if (cnt == 2) {
            that.triples.add(triples);
        }
    };

    store_wrap.store.execute('CONSTRUCT {?s ?p <' + that.node.nominalValue + '>} WHERE {?s ?p <' + that.node.nominalValue + '>}',
        function (err, result) {
            prepare_triples(result);
        },
        function () {
            prepare_triples();
            info.show("Error on local incoming triple loading.");
        });
    store_wrap.store.execute('CONSTRUCT {<' + this.node.nominalValue + '> ?p ?o} WHERE {<' + this.node.nominalValue + '> ?p ?o}',
        function (err, result) {
            prepare_triples(result);
        },
        function () {
            prepare_triples();
            info.show("Error on local outgoing triple loading.");
        });
};

module.exports = Named_node_layer;