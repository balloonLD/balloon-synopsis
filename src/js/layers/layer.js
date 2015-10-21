/**
 * Layer
 **/

var CSS = require("../const/css"), templating = require("../templating"), log = require("../logger.js")("Layer");
var factory = require('./factory'), info = require('../info'), Layout_engine_flex = require("../layout_engines/flexbox");
var Nav = require('../html_obj/nav'), e_ext = require("../util/event_obj_extender"), Triple_set = require("./triple_set");
var Scroll = require('../html_obj/scroll'), Util = require("../util/misc");
var plugin_name = require("../const/general_plugin").name;

var defaults = {
    sorters: [
        {
            label: "alphabet", fn: function (a, b) {
            var getComp = function (elem) {
                var $elem = $(elem);
                var label = $elem.find("." + CSS.label), itemText = label.length ? label
                    : $elem;
                return itemText.text();
            };
            return getComp(a).localeCompare(getComp(b));
        }
        },
        {
            label: "random", fn: function () {
            return Math.random() < 0.5 ? -1 : 1;
        }
        },
        {
            label: "weight", fn: function (a, b) {
            var getComp = function (elem) {
                var $elem = $(elem);
                var weight = $elem.data("weight");
                if (!((typeof weight === "undefined") || (weight === null))) {
                    return -1 * weight;
                } else {
                    return 0;
                }
            };
            return getComp(a) - getComp(b);
        }
        }
    ],
    filters: [
        {
            label: "in", priority: 1, fn: function (tile) {
            var data = $(tile).data("draft_data");
            if (data && data.hasOwnProperty("direction")) {
                return $(tile).data("draft_data").direction == "inc";
            } else {
                return false;
            }
        }
        },
        {
            label: "out", priority: 2, fn: function (tile) {
            var data = $(tile).data("draft_data");
            if (data && data.hasOwnProperty("direction")) {
                return $(tile).data("draft_data").direction == "out";
            } else {
                return false;
            }
        }
        }
    ],
    language_filter: true,
    filter_delay: 300
};

var Layer = function (detripling, decorating, msg, opt) {
    var that = this;

    // make html if not already defined
    if (!this._$html)
        this._$html = $(templating["layer"]({CSS: CSS, msg: msg}));

    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this._msg = msg;
    this.detripling = detripling;
    this.decorating = decorating;

    this.get_concepts = function (triples) {
        var concepts = {};
        for (var i = 0; i < triples.length; i++) {
            concepts[triples[i].object.interfaceName] = i;
        }
        return concepts;
    };

    this._$layout_container = this._$html.find("." + CSS.layout_container);
    this._$layout_footer = this._$html.find("." + CSS.layout_footer);
    this.layout_engine = new Layout_engine_flex(new Scroll(this._$layout_container), this._$layout_footer, msg);

    // Sorter
    this._$sort_options = this._$html.find("." + CSS.sorter + " .dropdown-menu");
    this._$sort_dropdown_toggle = this._$html.find("." + CSS.sorter + " .dropdown-toggle");
    for (var i = 0; i < this._opt.sorters.length; i++) {
        new Nav((function (that, fn) {
            return function (e) {
                that._$sort_dropdown_toggle.text(e.toElement.text);
                that.sort(fn);
            }
        })(this, this._opt.sorters[i].fn), this._msg.get("sort." + this._opt.sorters[i].label), this._$sort_options);
    }

    // Filter button click
    this._chosen_filters = [];
    var filter_btn = this._$html.find("." + CSS.filter_btn);
    filter_btn.on("click", (function (that) {
        return function (a, b) {
            that.filter();
        }
    })(this));

    // Filter options creation
    this._$filter_options = this._$html.find("." + CSS.filter + " .dropdown-menu");
    for (var j = 0; j < this._opt.filters.length; j++) {
        new Nav((function (that, fn, label, priority) {
            return function () {
                $(this).find("a").toggleClass("fa fa-check");
                var index = Util.arrayObjectIndexOf(that._chosen_filters, label, "label");
                if (index != -1) {
                    that._chosen_filters.splice(index, 1);
                } else {
                    that._chosen_filters.push({fn: fn, label: label, priority: priority});
                    that._chosen_filters.sort(function (a, b) {
                        return a.priority - b.priority
                    });
                }
            }
        })(this, this._opt.filters[j].fn, this._opt.filters[j].label, this._opt.filters[j].priority), this._msg.get("filter." + this._opt.filters[j].label), this._$filter_options);
    }

    // Filter text box input
    this._$filter_text_input = this._$html.find("." + CSS.filter + " .form-control");
    that._filter_text_last_value = "";
    this._$filter_text_input.keyup(function (e) {
        var current_text = $(this).val();
        Util.delay(function(){
            if (that._filter_text_last_value != current_text) {
                that._filter_text_last_value = current_text;
                that.filter();
            }
        }, that._opt.filter_delay );
    });

    // Title labels for the layer
    this.label = "Unknown";
    this.label_small = "Unknown URI";
    this.triples = new Triple_set();

    // Window resize event
    $(window).on("resize", function () {
        that.layout_engine.add([]);
    }.throttle(100));

    // Extend with events
    return e_ext(this);
};

Layer.prototype.tileify = function (triples) {
    var that = this;
    this.detripling.detriple(triples, this.get_concepts(triples), null, function (run) {
        var drafts = run.results;
        var detriplers = that.detripling.get_detriplers();
        var keys = Object.keys(drafts);
        var tiles = [];
        for (var i = 0; i < keys.length; i++) {
            tiles = tiles.concat(detriplers[keys[i]].templating_fn(drafts[keys[i]], triples));
        }

        // Add event functionality to tiles
        for (var j = 0; j < tiles.length; j++) {
            tiles = e_ext(tiles);
        }
        that.layout_engine.add(that.decorating.decorate(tiles));
    });
};

Layer.prototype.set_color = function (color) {
    this._$layout_footer.css("background-color", color);
};

Layer.prototype.get_html = function () {
    return this._$html;
};

Layer.prototype.sort = function (fn) {
    this.layout_engine.sort(fn);
};

Layer.prototype.filter = function (filter_string) {
    var filter_functions = [];
    for (var i = 0; i < this._chosen_filters.length; i++) {
        filter_functions.push(this._chosen_filters[i].fn)
    }

    var search_text = this._$filter_text_input.val();
    if (search_text != "") {
        filter_functions.push(function (text) {
            return function (div) {
                var sel = "div:containsInsensitive('" + text + "')";
                var array = div.find(sel);
                return (typeof array !== 'undefined' && array.length > 0);
            }
        }(search_text));
    }
    this.layout_engine.filter(filter_functions);
};

Layer.prototype.show_on = function (ele) {
    if (ele.data(plugin_name + "_layer"))
        ele.data(plugin_name + "_layer").destroy();
    ele.data(plugin_name + "_layer", this);
    ele.append(this.get_html());
};

Layer.prototype.load_remote = function () {
    // Implement in deriving layers
};

Layer.prototype.load_local = function () {
    // Implement in deriving layers
};

Layer.prototype.destroy = function () {
    var that = this;
    $(window).off("resize", function () {
        that.layout_engine.add([]);
    }.throttle(100));
    that.trigger("destroyed");
    that._$html.remove();
};

Layer.prototype.reload = function () {
    this.triples.clear();
    this.layout_engine.clear();
    this.load_local();
    this.load_remote();
};

module.exports = Layer;