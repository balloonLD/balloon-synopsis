var CSS = require("./const/css"), templating = require("./templating"), e_ext = require("./util/event_obj_extender"), log = require("./logger.js")("Overlay"), History = require("./history"), Nav = require("./html_obj/nav");
var pN = require("./const/general_plugin").name;
var defaults = {};

var Overlay = function (layer, msg, z_index, ele, opt) {
    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this._cur_z_index = z_index;
    this._$html = $(templating['overlay']({CSS: CSS, z_index: z_index, label: layer.label, label_small: layer.label_small}));

    var that = this;
    this._menu = $(this._$html.find("." + CSS.menu));
    this._inner_menu = $(this._$html.find("." + CSS.overlay_menu));
    this.back_btn = new Nav(function () {
        that.trigger("go_back");
    }, msg.get("back"), this._inner_menu);
    this.history_btn = new Nav(
        function () {
            that.trigger("show_history");
        }, msg.get("history"), this._inner_menu, ["fa", "fa-history"]);
    this.history_btn.toggle_disable();
    this.close_btn = new Nav(function () {
            that.close();
        }, msg.get("close"), this._inner_menu, ["fa", "fa-times"]
    );

    this._$content = this._$html.find("." + CSS.overlay_content);

    ele.append(this._$html);

// Extend with events
    return e_ext(this);
};

Overlay.prototype.set_content = function (ele) {
    this._$content.empty();
    this._$content.append(ele);
};

Overlay.prototype.get_content = function () {
    return this._$content;
};

Overlay.prototype.show = function (clip) {
    if (clip)
        log(clip);
    //TODO transition start

    this._$html.addClass(CSS.fadeIn);
};

Overlay.prototype.hide = function (clip, cb) {
    if (clip)
        log(clip);
    // TODO transition end

    if (cb)
        // TODO hide transition
        cb();
        //if (L_util.getTransitionSupport()) {
        //    this._$html.once(L_util.getTransEndEventName(), cb);
        //} else {
        //    cb();
        //}
    this._$html.removeClass(CSS.fadeIn);
};

Overlay.prototype.set_color = function(color) {
    this._menu.css("background-color", color);
};

Overlay.prototype.close = function (clip) {
    var that = this;
    this.hide(null, function () {
        that.trigger("closed");
        that.destroy();
    });
};

Overlay.prototype.destroy = function () {
    if (this.get_content().data(pN + "_layer"))
        this.get_content().data(pN + "_layer").destroy();
    this._$html.remove();
};

module.exports = Overlay;