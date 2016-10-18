/**
 * Layer used to show the contents of an MICO item.
 **/

var CSS = require("../../const/css"), store_wrap = require("../../store").get(), templating = require("../../templating"), log = require("../../logger.js")("Layer_query");
var info = require('../../info');
var Layer = require('../layer');
var Query_layer = require('../types/query_layer');

var Part_layer = function (detripling, decorating, msg, item, opt) {
    this.item = item;
    this._query = "CONSTRUCT { <"+item.nominalValue+"> <http://www.mico-project.eu/ns/mmm/2.0/schema#hasPart> ?o } WHERE { <"+item.nominalValue+"> <http://www.mico-project.eu/ns/mmm/2.0/schema#hasPart> ?o}";
    Query_layer.call(this, detripling, decorating, msg, this._query, opt);
    this.id = item.nominalValue;
    this.label = item.nominalValue;
    this.label_small = "";
    var that = this;

    this.get_concepts = function (triples) {
        var concepts = {part: []};
        for (var i = 0; i < triples.length; i++) {
            concepts["part"].push(triples[i].object.nominalValue);
        }
        return concepts;
    };
};

Part_layer.prototype = Object.create(Layer.prototype);
Part_layer.prototype.constructor = Item_layer;

Part_layer.prototype.load_remote = function () {
    var that = this;
    this.trigger("request_remote", ['SELECT DISTINCT ?s ?p ?o where {?s ?p ?o. VALUES ?s {<' + this.item.nominalValue + '>} VALUES ?p {<http://www.mico-project.eu/ns/mmm/2.0/schema#hasBody>}}'], function (resp, b, remote_num, partial) {
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

module.exports = Part_layer;