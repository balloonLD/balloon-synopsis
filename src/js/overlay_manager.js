/**
 * Overlay management for synopsis
 **/

var CSS = require("./const/css"), store = require("./store").get(), templating = require("./templating"),
    log = require("./logger.js")("Overlay_manager"), History = require("./history"),
    Overlay = require("./overlay");

var defaults = {z_index: 2000, max_overlays: 1};

var Overlay_manager = function (history, msg, ele, opt) {
    this.overlays = [];
    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this._cur_z_index = this._opt.z_index;
    this._$container = $(templating['overlay_container']({CSS: CSS}));
    ele.append(this._$container);
    this._$parent = $(ele);
    this._history = history;
    this._msg = msg;
};

Overlay_manager.prototype.make_overlay = function (layer) {
    var overlay = new Overlay(layer, this._msg, this._cur_z_index, this._$container);
    this._history.add(layer);
    var that = this;
    overlay.on("go_back", function() {
        that._history.back();
    });
    overlay.on("show_history", function() {
        that._history.show();
    });
    this.overlays.push(overlay);
    this._cur_z_index++;
    if (this._opt.max_overlays < this.overlays.length) {
        var o = this.overlays.shift();
        o.destroy();
    }
    overlay.show();

    // hide scrollbars of parents
    if (this.overlays.length == 1) {
        this._$container.parents().addClass(CSS.no_scroll);
    }
    overlay.on("closed", function () {
        that.overlays.pop();
        if (that.overlays.length == 0) {
            that._$container.parents().removeClass(CSS.no_scroll);
        }
    });

    return overlay;
};

Overlay_manager.prototype.destroy_all = function () {
    for (var i = 0; i < this.overlays.length; i++) {
        this.overlays[i].destroy();
    }
};

module.exports = Overlay_manager;