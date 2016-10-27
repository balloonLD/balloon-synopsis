/**
 * Layer used to show the contents of an MICO item.
 **/

var CSS = require("../../const/css"), store_wrap = require("../../store").get(), templating = require("../../templating"), log = require("../../logger.js")("Layer_query");
var info = require('../../info');
var Layer = require('../layer');
var Query_layer = require('../types/query_layer');

var Out_layer = function (detripling, decorating, msg, item, opt) {
    this.item = item;
    this._query = "CONSTRUCT { <"+item.nominalValue+"> ?p ?o } WHERE { <"+item.nominalValue+"> ?p ?o}";
    Query_layer.call(this, detripling, decorating, msg, this._query, opt);
    this.id = item.nominalValue;
    this.label = item.nominalValue;
    this.label_small = "";

    this.get_concepts = function (triples) {
        var concepts = {};
        for (var i = 0; i < triples.length; i++) {
            if (!concepts["outgoing."+triples[i].object.interfaceName]) {
                concepts["outgoing."+triples[i].object.interfaceName] = [];
            }
            concepts["outgoing."+triples[i].object.interfaceName].push(i);
        }
        return concepts;
    };
};

Out_layer.prototype = Object.create(Layer.prototype);
Out_layer.prototype.constructor = Out_layer;

Out_layer.prototype.load_remote = function () {
    var that = this;
    this.trigger("request_remote", ['SELECT DISTINCT ?s ?p ?o where {?s ?p ?o. VALUES ?s {<' + this.item.nominalValue + '>}}'], function (resp, b, remote_num, partial) {
        var graph = store_wrap.store.parser.parse_to_graph(resp.results.bindings, ["s", "p", "o"]);
        that.triples.add(graph.triples);
        if (partial) {
            b.do_partial_progress(remote_num);
        } else {
            b.do_progress(remote_num);
        }
    });
};

module.exports = Out_layer;