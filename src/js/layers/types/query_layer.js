/**
 * Layer
 **/

var CSS = require("../../const/css"), store_wrap = require("../../store").get(), templating = require("../../templating"), log = require("../../logger.js")("Layer_query");
var info = require('../../info');
var Layer = require('../layer');

var Query_layer = function (detripling, decorating, msg, query, opt) {
    Layer.call(this, detripling, decorating, msg, opt);
    this.id = query;
    this._query = query;
    var that = this;

    // Store observing
    store_wrap.store.startObservingQuery.call(store_wrap.store, this._query, function (observed) {
        log("Got new triples by query", observed);
        that.triples.add(observed.triples);
    });

    // On new triples
    that.triples.on("updated", function (triples, new_triples) {
        log("Updated", [triples]);
        that.tileify(triples);
    });
};

Query_layer.prototype = Object.create(Layer.prototype);
Query_layer.prototype.constructor = Query_layer;

Query_layer.prototype.load_local = function () {
    var that = this;
    store_wrap.store.execute(this._query, function (err, results) {
            that.triples.add(results.triples);
        },
        function () {
            info.show("Error on local triple loading by query");
        })
};

module.exports = Query_layer;