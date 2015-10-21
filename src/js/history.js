var cytoscape = require("cytoscape"), CSS = require("./const/css"), templating = require("./templating"), log = require("./logger.js")("History");
var Layer_factory = require("./layers/factory");

var History = function (synopsis, opt) {
    this._$history = $(templating['history']({CSS: CSS}));
    this._synopsis = synopsis;
    synopsis._$ele.append(this._$history);
    this._layer_data = {};
    this._add_history = [];
    this._current_add_history_index = 0;
};

History.prototype.add = function (layer) {
    if (this._ignore_next_add) {
        delete this._ignore_next_add;
    } else {
        this._add_history.push(layer.id);
        this._current_add_history_index++;
        if (!this._layer_data.hasOwnProperty(layer.id)) {
            this._layer_data[layer.id] = {make_arguments: layer.make_arguments, post_view_cbs: layer.post_view_cbs};
        }
    }
};

History.prototype.back = function (cb) {
    if (this._add_history.length > 1) {
        this._ignore_next_add = true;
        this._add_history.pop();
        var uri = this._add_history[this._add_history.length - 1];
        var layer = Layer_factory.make.apply(Layer_factory, this._layer_data[uri].make_arguments);
        layer.post_view_cbs = this._layer_data[uri].post_view_cbs;
        this._synopsis.show(layer, function (view) {
            // Get callback functions to call after showing layer
            for (var i = 0, ilen = view.layer.post_view_cbs.length; i < ilen; i++) {
                view.layer.post_view_cbs[i].apply(null, arguments);
            }
            if (cb)
                cb.apply(null, arguments);
        });
    } else {
        this._add_history = [];
        this._synopsis.overlay_manager.destroy_all();
    }
};

History.prototype.show = function () {
    log("show")
};

module.exports = History;