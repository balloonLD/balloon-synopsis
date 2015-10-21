/**
 * Layer
 **/

var CSS = require("../../const/css"), store_wrap = require("../../store").get(), templating = require("../../templating"), log = require("../../logger.js")("Layer_pattern");
var info = require('../../info');
var Layer = require('../layer');

var Pattern_layer = function (detripling, decorating, msg, patterns, opt) {
    Layer.call(this, detripling, decorating, msg, opt);
    this._patterns = patterns;

    var that = this;
    for (var i = 0; i < this._patterns.length; i++) {
        var pattern = patterns[i];
        pattern.push(function (ev, triples) {
            that.log(triples);
        });
        store_wrap.store.subscribe.apply(store_wrap.store, pattern);
    }

};

Pattern_layer.prototype = Object.create(Layer.prototype);
Pattern_layer.prototype.constructor = Pattern_layer;

module.exports = Pattern_layer;