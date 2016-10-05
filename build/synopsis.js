(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "synopsis",
  "version": "0.2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/schlegel/balloon-synopsis"
  },
  "devDependencies": {
    "assemble-less": "~0.7.0",
    "browserify": "~5.10.1",
    "browserify-shim": "~3.8.5",
    "grunt": "^0.4.0",
    "grunt-bower-requirejs": "~1.1.0",
    "grunt-bower-task": "~0.4.0",
    "grunt-browserify": "~3.7.0",
    "grunt-contrib-clean": "~0.6.0",
    "grunt-contrib-copy": "~0.5.0",
    "grunt-contrib-handlebars": "~0.5.4",
    "grunt-contrib-jasmine": "~0.8.2",
    "grunt-contrib-jshint": "~0.4.1",
    "grunt-contrib-yuidoc": "~0.5.0",
    "grunt-wiredep": "~1.7.1"
  },
  "browserify-shim": {
    "jquery": "global:$",
    "handlebars": "global:Handlebars",
    "bows": "global:bows",
    "rdfstore": "global:rdfstore",
    "modernizr": "global:Modernizr",
    "backbone": "global:Backbone",
    "cytoscape": "global:cytoscape",
    "md5": "global:md5",
    "chroma-js": "global:chroma",
    "js-md5": "global:md5"
  },
  "browserify": {
    "transform": [
      "browserify-shim"
    ]
  }
}

},{}],2:[function(require,module,exports){
var name = require("./general_plugin.js").name;
var css = {
    "monolog": "monolog",
    "fadeIn": "fadeIn",
    "flex": "flex",
    "show": "show",
    "tile": "tile",
    "flex_parent": "flex_parent",
    "menu": "menu",
    "overlay_menu": "overlay_menu",
    "overlay": "overlay",
    "history": "history",
    "menu_label": "menu_label",
    "overlay_container": "overlay_container",
    "overlay_content": "overlay_content",
    "filter": "filter",
    "filter_btn": "filter_btn",
    "sorter": "sorter",
    "named_node": "named_node",
    "layer": "layer",
    "layout_container": "layout_container",
    "dropdown": "dropdown",
    "dropdown_item": "dropdown_item",
    "btn": "btn",
    "btn_toolbar": "btn_toolbar",
    "btn_grp": "btn_grp",
    "navbar_collapse": "navbar_collapse",
    "navbar_nav": "navbar_nav",
    "navbar_nav_item": "navbar_nav_item",
    "progress_container": "progress_container",
    "progress_bar": "progress_bar",
    "progress_container_wrap": "progress_container_wrap",
    "no_scroll": "no_scroll",
    "scroll_box": "scroll_box",
    "scroll_box_content": "scroll_box_content",
    "layout_footer": "layout_footer",
    "semantic_color": "semantic_color",
    "uri": "uri",
    "label": "label",
    "uri_to_label": "uri_to_label",
    "dynamic_text_size": "dynamic_text_size",
    "shrink": "shrink",
    "y_scroll": "y_scroll",
    "thumbnail": "thumbnail",
    "hidden": "hidden",
    "disabled": "disabled",
    "literal": "literal"
};
var prefix = require("./general_plugin.js").prefix ? require("./general_plugin.js").prefix : name.length >= 3 ? name.substr(0, 3) + "_" : name + "_";

var keys = Object.keys(css);
for (var i = 0; i < keys.length; i++) {
    css[keys[i]] = prefix + css[keys[i]];
}


module.exports = css;
},{"./general_plugin.js":3}],3:[function(require,module,exports){
var package_json = require("../../../package.json");

var misc = {
    "name": package_json.name,
    "sorter-prefix": "sorter-",
    "filter-prefix": "filter-"
};

if (!misc.hasOwnProperty("prefix")) {
    misc.prefix = misc.name.length >= 3 ? misc.name.substr(0, 3) + "_" : "";
}

module.exports = misc;
},{"../../../package.json":1}],4:[function(require,module,exports){
var decorators = {keys_for_decorators: []};

var add = function (Decorator) {
    var decorator = new Decorator();
    decorators[decorator.id] = decorator;
    decorators.keys_for_decorators.push(decorator.id);
};

add(require("./decorators/browsability"));
add(require("./decorators/semantic_color"));
add(require("./decorators/uri_to_label"));
add(require("./decorators/uri_to_thumbnail"));
add(require("./decorators/text_size"));

module.exports = decorators;
},{"./decorators/browsability":5,"./decorators/semantic_color":6,"./decorators/text_size":7,"./decorators/uri_to_label":8,"./decorators/uri_to_thumbnail":9}],5:[function(require,module,exports){
var log = require("../../logger")("Browsability decorator"), info = require('../../info'), Layer_factory = require("../../layers/factory");
RDFModel = window.RDFModel;

var Decorator = function () {
    this.id = "browsability";
    this.config = {
        "outgoing.named": function (draft) {
            return draft.triple.object;
        }, "incoming.named": function (draft) {
            return draft.triple.subject;
        },
        "multi.named": function (draft) {
            return draft.resource;
        }
    };
    this.decorate = function (divs, synopsis, config, cb) {
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var type = div.data("type");
            if (config.hasOwnProperty(type)) {
                div.on("click", function (target_resource, data) {
                    return function () {
                        var layer = Layer_factory.make(synopsis, target_resource);
                        if (data["post_view_cbs"]) {
                            layer.post_view_cbs = data["post_view_cbs"];
                            synopsis.show(layer, function (view) {
                                // Get callback functions to call after showing layer
                                for (var i = 0, ilen = view.layer.post_view_cbs.length; i < ilen; i++) {
                                    view.layer.post_view_cbs[i].apply(null, arguments);
                                }
                                if (cb)
                                    cb.apply(null, arguments);
                            });
                        } else {
                            synopsis.show(layer, cb);
                        }
                    };
                }(config[type](div.data("draft_data")), div.data()));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;
},{"../../info":29,"../../layers/factory":32,"../../logger":41}],6:[function(require,module,exports){
(function (global){
var log = require("../../logger")("Browsability decorator"), chroma = (typeof window !== "undefined" ? window['chroma'] : typeof global !== "undefined" ? global['chroma'] : null), md5 = (typeof window !== "undefined" ? window['md5'] : typeof global !== "undefined" ? global['md5'] : null), CSS = require("../../const/css");
var Debounced_remote = require("../../remote/debounced_remote");
RDFModel = window.RDFModel;

var color_map = {};

var add_to_color_map = function (uri, types, cb) {
    if (!color_map[uri])
        color_map[uri] = {types: [], final_color: null};
    for (var i = 0; i < types.length; i++) {
        var type = types[i].o.value ? types[i].o.value : types[i].o.nominalValue;
        color_map[uri].types[i] = {uri: type, color: chroma("#" + md5(type).substring(0, 6))};
        if (!color_map[uri].final_color) {
            color_map[uri].final_color = color_map[uri].types[i].color;
        } else {
            var scale = chroma.scale([color_map[uri].final_color.hex(), "#" + md5(type).substring(0, 6)]).mode('lab');
            color_map[uri].final_color = chroma(scale(0.5).hex());
        }
    }
    cb();
};

var colorize = function (ele, uri) {
    if (color_map[uri]) {
        var $ele = $(ele);

        // Add color to newly opened layers
        var post_view_cbs = $ele.data("post_view_cbs");
        if (!post_view_cbs) {
            $ele.data("post_view_cbs", []);
            post_view_cbs = $ele.data("post_view_cbs");
        }
        post_view_cbs.push(function (color) {
            return function (view) {
                view.layer.set_color(color);
                view.overlay.set_color(color);
                return view;
            }
        }(color_map[uri].final_color));
        $ele.data("post_view_cbs", post_view_cbs);

        // Color segments of div which are marked with semantic_color class
        if ($ele.hasClass(CSS.semantic_color)) {
            $(ele).css("background-color", color_map[uri].final_color);
        }
        $ele.find("." + CSS.semantic_color).css("background-color", color_map[uri].final_color);
        return true;
    } else {
        return false;
    }
};

var Decorator = function () {
    this.id = "semantic_color";
    this.config = {
        "outgoing.named": function (draft) {
            return draft.triple.object.nominalValue;
        }, "incoming.named": function (draft) {
            return draft.triple.subject.nominalValue;
        },
        "multi.named": function (draft) {
            return draft.resource.nominalValue;
        }
    };
    this.decorate = function (divs, synopsis, config, cb) {
        var debounced_remote_loader = new Debounced_remote(synopsis, "SELECT DISTINCT ?value ?o WHERE {?value rdf:type ?o. " + Debounced_remote.dummy + " }", null);
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];
            var type = div.data("type");
            if (config.hasOwnProperty(type)) {
                div.on("appended", function (d, uri_fn) {
                    var resource_uri = uri_fn(d.data("draft_data"));
                    return function () {
                        if (!colorize(d, resource_uri)) {
                            var color_query = "SELECT DISTINCT ?o WHERE {<" + resource_uri + "> rdf:type ?o. }";
                            synopsis.store_wrap.store.execute(color_query, function (e, res) {
                                if (res == undefined || res.length == 0) {
                                    debounced_remote_loader.add_value(resource_uri, function (bindings) {
                                        if (!colorize(d, resource_uri) && bindings.length > 0) {
                                            add_to_color_map(resource_uri, bindings, function () {
                                                colorize(d, resource_uri);
                                            })
                                        }
                                    });
                                } else {
                                    add_to_color_map(resource_uri, res, function () {
                                        colorize(d, resource_uri);
                                    })
                                }
                            });

                        }
                        if (resource_uri.indexOf(RDFModel.rdf.prefixes.rdfs) != -1 || resource_uri.indexOf(RDFModel.rdf.prefixes.owl) !== -1) {
                            // TODO rdfs and owl as unimportant
                        }
                    };
                }(div, config[type]));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../const/css":2,"../../logger":41,"../../remote/debounced_remote":46}],7:[function(require,module,exports){
var log = require("../../logger")("Browsability decorator"), CSS = require("../../const/css");
RDFModel = window.RDFModel;

// ========================= JQuery textfill
// https://gist.github.com/mekwall/1263939 Source code by Marcus Ekwall
// Modifications by Thomas Weißgerber
(function ($) {
    $.fn.textfill = function (maxFontSize, minFontSize, fail) {
        maxFontSize = parseInt(maxFontSize, 10);
        minFontSize = parseInt(minFontSize, 10);
        return this
            .each(function (i, val) {
                var ourText = $(val), parent = ourText.parent(), maxHeight = parent.height(), maxWidth = parent
                    .width(), fontSize = parseInt(ourText.css("fontSize"), 10), tmpMultW = maxWidth
                    / ourText.width(), tmpMultH = maxHeight / ourText.height(), multiplier = (tmpMultW < tmpMultH) ? tmpMultW
                    : tmpMultH, newSize = (fontSize * (multiplier - 0.1));
                if (maxFontSize > 0 && newSize > maxFontSize) {
                    newSize = maxFontSize;
                }
                if (minFontSize > 0 && newSize < minFontSize) {
                    fail(parent);
                    newSize = minFontSize;
                    ourText.css("fontSize", newSize);
                } else {
                    ourText.css("fontSize", newSize);
                    while (parent.get(0).scrollWidth > parent.width()) {
                        minFontSize--;
                        if (minFontSize > 0 && newSize < minFontSize) {
                            fail(parent);
                            newSize = minFontSize;
                            ourText.css("fontSize", newSize);
                            break;
                        } else {
                            ourText.css("fontSize", newSize);
                        }
                    }
                }
            });
    };
})(jQuery);

var Decorator = function () {
    this.id = "text_size";
    this.decorate = function (divs, synopsis, config, cb) {
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var dyn_text_div = div.find("." + CSS.dynamic_text_size);
            dyn_text_div.textfill(80, 12, function ($parent) {
                $parent.css({
                    "overflow-y": "auto",
                    "word-wrap": "break-word"
                })
            });
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;
},{"../../const/css":2,"../../logger":41}],8:[function(require,module,exports){
var log = require("../../logger")("URI_TO_LABEL decorator"), CSS = require("../../const/css");
var Debounced_remote = require("../../remote/debounced_remote");

var label_map = {};

var add_to_label_map = function (uri, labels, cb) {
    if (!label_map[uri]) {
        label_map[uri] = {};
    }
    for (var i = 0; i < labels.length; i++) {
        var language = labels[i].o["xml:lang"] ? labels[i].o["xml:lang"] : "undefined";
        label_map[uri][language] = labels[i].o;
    }
    cb();
};

var labelize = function (ele, uri, language) {
    if (label_map[uri]) {
        var label = label_map[uri][language] ? label_map[uri][language].value : label_map[uri]["undefined"] ? label_map[uri]["undefined"].value : label_map[uri][Object.keys(label_map[uri])[0]].value;
        ele.text(label);
        ele.addClass(CSS.uri_to_label);
        $(ele).prop("title", uri);
        $(ele).tooltipster({interactive: true}); //fix multiple call
        return true;
    } else {
        return false;
    }
};

var Decorator = function () {
    this.id = "uri_to_label";
    this.config = {
        "outgoing.blank": true,
        "outgoing.literal": true,
        "outgoing.named": true,
        "incoming.blank": true,
        "incoming.named": true,
        "multi.named": true
    };
    var isValidUri = function (value) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    };

    this.decorate = function (divs, synopsis, config, cb) {
        var language = synopsis.msg.get_language();
        var debounced_remote_loader = new Debounced_remote(synopsis, "SELECT DISTINCT ?value ?o WHERE { ?value rdfs:label ?o." + Debounced_remote.dummy + " }", null);
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var type = div.data("type");
            if (config.hasOwnProperty(type)) {
                div.on("appended", function (d) {
                    return function () {
                        var eles = d.find("." + CSS.uri);
                        eles.each(function (i, ele) {

                            // At first save the content of the element as uri data for the element
                            ele = $(ele);
                            if (!ele.data("uri"))
                                ele.data("uri", ele.text().trim());

                            // Get uri and check if we can labelize it
                            var uri = ele.data("uri");
                            if (isValidUri(uri) && !labelize(ele, uri, language)) {
                                var label_query = "SELECT DISTINCT ?o WHERE {{<" + uri + "> rdfs:label ?o. } UNION {<" + uri + "> foaf:name ?o. }}";
                                synopsis.store_wrap.store.execute(label_query, function (_ele, _uri) {
                                    return function (_, res) {
                                        if (res.length == 0) {
                                            debounced_remote_loader.add_value(_uri, function (__ele, __uri) {
                                                return function (bindings) {
                                                    if (!labelize(__ele, __uri, language)) {
                                                        if (bindings.length > 0) {
                                                            add_to_label_map(__uri, bindings, function () {
                                                                labelize(__ele, __uri, language);
                                                            })
                                                        } else {
                                                            var splitted = __uri.split("/");
                                                            var label = null;
                                                            for (var i = splitted.length - 1; i > 0; i--) {
                                                                if (splitted[i].length > 0) {
                                                                    label = splitted[i];
                                                                    break;
                                                                }
                                                            }
                                                            add_to_label_map(__uri, [{
                                                                o: {
                                                                    value: label,
                                                                    type: "extracted"
                                                                }
                                                            }], function () {
                                                                labelize(__ele, __uri, language);
                                                            })
                                                        }
                                                    }
                                                }
                                            }(_ele, _uri));
                                        } else {
                                            add_to_label_map(_uri, res, function () {
                                                labelize(_ele, _uri, language);
                                            })
                                        }
                                    }
                                }(ele, uri));
                            }
                        });
                    }
                }(div));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;
},{"../../const/css":2,"../../logger":41,"../../remote/debounced_remote":46}],9:[function(require,module,exports){
var log = require("../../logger")("URI_TO_THUMBNAIL decorator"), CSS = require("../../const/css");
var Debounced_remote = require("../../remote/debounced_remote");

var image_map = {};

var add_to_image_map = function (uri, labels, cb) {
    if (!image_map[uri]) {
        image_map[uri] = {};
    }
    for (var i = 0; i < labels.length; i++) {
        image_map[uri][labels[i].o.value] = labels[i].o;
    }
    cb();
};

var imageify = function (ele, uri) {
    if (image_map[uri]) {
        var tile = ele.closest("."+CSS.tile);
        if (!tile.data("image")) {
            var image_uris = Object.keys(image_map[uri]);
            //ele.css("background-image", "url("+image_map[uri][0]+")");
            tile.data("image", image_uris[0]);
            var width = tile.width() - 20;
            tile.prepend("<div class='" + CSS.shrink + "'><img class="+ CSS.thumbnail +" src='"+image_uris[0]+"' width='"+ width +"'></div>");
        }
        return true;
    } else {
        return false;
    }
};

var Decorator = function () {
    this.id = "uri_to_image";
    this.config = {
        "outgoing.blank": true,
        "outgoing.literal": true,
        "outgoing.named": true,
        "incoming.blank": true,
        "incoming.named": true,
        "multi.named": true
    };
    this.decorate = function (divs, synopsis, config, cb) {
        var debounced_remote_loader = new Debounced_remote(synopsis, "SELECT DISTINCT ?value ?o WHERE { ?value <http://dbpedia.org/ontology/thumbnail> ?o." + Debounced_remote.dummy + " }", null);
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var type = div.data("type");
            if (config.hasOwnProperty(type)) {
                div.on("appended", function (d) {
                    return function () {
                        var eles = d.find("." + CSS.uri);
                        eles.each(function (i, ele) {

                            // At first save the content of the element as uri data for the element
                            ele = $(ele);
                            if (!ele.data("uri"))
                                ele.data("uri", ele.text().trim());

                            // Get uri and check if we can imageify it
                            var uri = ele.data("uri");
                            if (!imageify(ele, uri)) {
                                var image_query = "SELECT DISTINCT ?o WHERE {{<" + uri + "> <http://dbpedia.org/ontology/thumbnail> ?o. } UNION {<" + uri + "> foaf:name ?o. }}";
                                synopsis.store_wrap.store.execute(image_query, function (_ele, _uri) {
                                    return function (_, res) {
                                        if (res.length == 0) {
                                            debounced_remote_loader.add_value(_uri, function (__ele, __uri) {
                                                return function (bindings) {
                                                    if (!imageify(__ele, __uri)) {
                                                        if (bindings.length > 0) {
                                                            add_to_image_map(__uri, bindings, function () {
                                                                imageify(__ele, __uri);
                                                            })
                                                        }
                                                    }
                                                }
                                            }(_ele, _uri));
                                        } else {
                                            add_to_image_map(_uri, res, function () {
                                                imageify(_ele, _uri);
                                            })
                                        }
                                    }
                                }(ele, uri));
                            }
                        });
                    }
                }(div));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;
},{"../../const/css":2,"../../logger":41,"../../remote/debounced_remote":46}],10:[function(require,module,exports){
var log = require("./../logger")("Decorator_manager");

var decorators = require("./decorators.js");

var defaults = {
    decorators: decorators
};

var Manager = function (opt, synopsis) {
    this.synopsis = synopsis;
    this._opt = $.extend(true, {}, defaults, opt);
    var decorator_keys = Object.keys(defaults.decorators);
    if (opt.decorators)
        for (var i = 0; i < decorator_keys.length; i++) {
            if (opt.decorators[decorator_keys[i]])
                this._opt.decorators[decorator_keys[i]] = $.extend(true, {}, defaults.decorators[decorator_keys[i]], opt.decorators[decorator_keys[i]]);
        }
};

Manager.prototype.decorate = function (divs, cb) {
    for (var i = 0; i < this._opt.decorators.keys_for_decorators.length; i++) {
        divs = this._opt.decorators[this._opt.decorators.keys_for_decorators[i]].decorate(divs, synopsis, this._opt.decorators[this._opt.decorators.keys_for_decorators[i]].config);
    }
    if (cb)
        cb(divs);
    return divs;
};

module.exports = Manager;
},{"./../logger":41,"./decorators.js":4}],11:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "incoming.blank";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.incoming.blank";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("incoming.BlankNode", function (blank) {
            if (blank) {
                while (blank.length > 0) {
                    var index = blank.pop();
                    var triple = triples[index];
                    draft.push({direction: "inc", triple: triple});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],12:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "incoming.named";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.incoming.named";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("incoming.NamedNode", function (named) {
            if (named) {
                while (named.length > 0) {
                    var index = named.pop();
                    var triple = triples[index];
                    draft.push({direction: "inc", triple: triple});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],13:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "map";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.map";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept('outgoing.Literal', function (literal) {
            if (literal) {
                var tmp = {out: {lat: null, long: null}};
                while (literal.length > 0) {
                    var index = literal.pop();
                    var triple = triples[index];
                    if (triple.predicate.nominalValue == 'http://www.w3.org/2003/01/geo/wgs84_pos#long') {
                        tmp.out.long = triple.object.nominalValue;
                    } else if (triple.predicate.nominalValue == 'http://www.w3.org/2003/01/geo/wgs84_pos#lat') {
                        tmp.out.lat = triple.object.nominalValue;
                    }
                }
                if (tmp.out.lat && tmp.out.long) {
                    draft.push({direction: "outgoing", longitude: tmp.out.lat, latitude: tmp.out.long});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],14:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "multi.named";

var Detripler = function () {
        Base_detripler.call(this, ID);
        this.worker = true;
        this.parents = ["incoming.named", "outgoing.named"];
        this.template_id = "tiles.multi.named";
        this.fn = function (triples, transport, cb) {
            var draft = [], tmp = {};

            // get incoming draft and search for same subjects
            var inc_draft;
            transport.get_draft("incoming.named", function (inc_named) {
                inc_draft = inc_named;
                for (var i = 0; i < inc_named.length; i++) {
                    var inc_triple = inc_named[i].triple;
                    if (!tmp[inc_triple.subject.nominalValue]) {
                        tmp[inc_triple.subject.nominalValue] = {
                            inc: [{triple: inc_triple, index: i}],
                            out: []
                        };
                        tmp[inc_triple.subject.nominalValue].length = 1;
                    } else {
                        tmp[inc_triple.subject.nominalValue].inc.push({triple: inc_triple, index: i});
                        tmp[inc_triple.subject.nominalValue].length++;
                    }
                }
            });

            // get outgoing draft and search for same objects
            var out_draft;
            transport.get_draft("outgoing.named", function (out_named) {
                out_draft = out_named;
                for (var i = 0; i < out_named.length; i++) {
                    var out_triple = out_named[i].triple;
                    if (!tmp[out_triple.object.nominalValue]) {
                        tmp[out_triple.object.nominalValue] = {
                            inc: [],
                            out: [{triple: out_triple, index: i}]
                        };
                        tmp[out_triple.object.nominalValue].length = 1;
                    } else {
                        tmp[out_triple.object.nominalValue].out.push({triple: out_triple, index: i});
                        tmp[out_triple.object.nominalValue].length++;
                    }
                }
            });

            // Modify flags
            var inc_draft_delete_indexes = [], out_draft_delete_indexes = [];
            var found_targets = Object.keys(tmp);
            for (var i = 0; i < found_targets.length; i++) {
                if(tmp[found_targets[i]].length > 1) {
                    var draft_triples = {out: [], inc: []}, draft_resource = null;
                    var inc_data = tmp[found_targets[i]].inc;
                    for (var j = 0; j < inc_data.length; j++) {
                        if (!draft_resource)
                            draft_resource = inc_data[j].triple.subject;
                        draft_triples.inc.push(inc_data[j].triple);
                        inc_draft_delete_indexes.push(inc_data[j].index);
                    }
                    var out_data = tmp[found_targets[i]].out;
                    for (var k = 0; k < out_data.length; k++) {
                        if (!draft_resource)
                            draft_resource = out_data[j].triple.object;
                        draft_triples.out.push(out_data[k].triple);
                        out_draft_delete_indexes.push(out_data[k].index);
                    }

                    // add to final draft
                    draft.push({resource: draft_resource, triples: draft_triples});
                }
            }

            if (inc_draft_delete_indexes.length > 0 || out_draft_delete_indexes.length > 0) {
                // Modify drafts
                var wait_for_n_mods = 0;
                if (inc_draft_delete_indexes.length > 0)
                    wait_for_n_mods++;
                if (out_draft_delete_indexes.length > 0)
                    wait_for_n_mods++;
                var mods_done = 0;
                if (inc_draft_delete_indexes.length > 0)
                    inc_draft_delete_indexes.sort(function(a, b) {return a-b;});
                while (inc_draft_delete_indexes.length > 0) {
                    var index = inc_draft_delete_indexes.pop();
                    inc_draft.splice(index, 1);
                }
                transport.set_draft("incoming.named", inc_draft, function () {
                    mods_done++;
                    if (mods_done == wait_for_n_mods)
                        cb(draft);
                });
                if (out_draft_delete_indexes.length > 0)
                    out_draft_delete_indexes.sort();
                while (out_draft_delete_indexes.length > 0) {
                    var index = out_draft_delete_indexes.pop();
                    out_draft.splice(index, 1);
                }
                transport.set_draft("outgoing.named", out_draft, function () {
                    mods_done++;
                    if (mods_done == wait_for_n_mods)
                        cb(draft);
                });
            } else {
                cb([]);
            }
        };

    }
    ;

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],15:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "outgoing.blank";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.outgoing.blank";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("outgoing.BlankNode", function (blank) {
            if (blank) {
                while (blank.length > 0) {
                    var index = blank.pop();
                    var triple = triples[index];
                    draft.push({direction: "out", triple: triple});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],16:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "outgoing.literal";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.outgoing.literal";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("outgoing.Literal", function (literal) {
            if (literal) {
                while (literal.length > 0) {
                    var index = literal.pop();
                    var triple = triples[index];
                    draft.push({direction: "out", triple: triple});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],17:[function(require,module,exports){
var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "outgoing.named";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.outgoing.named";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("outgoing.NamedNode", function (named) {
            if (named) {
                while (named.length > 0) {
                    var index = named.pop();
                    var triple = triples[index];
                    draft.push({direction: "out", triple: triple});
                }
            }
            cb(draft);
        });
    };
};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;
},{"../../const/css":2,"../../templating":51,"../scheme":24}],18:[function(require,module,exports){
var detriplers = {};

var add = function (c) {
    for (var i = 0; i < c.length; i++) {
        var Detripler = c[i];
        var d = new Detripler();
        detriplers[d.id] = d;
    }
};

var constructors = [
    require("./detripler/incoming.blank"),
    require("./detripler/incoming.named"),
    require("./detripler/outgoing.blank"),
    require("./detripler/outgoing.named"),
    require("./detripler/outgoing.literal"),
    require("./detripler/map"),
    require("./detripler/multi.named")
];

add(constructors);

module.exports = detriplers;
},{"./detripler/incoming.blank":11,"./detripler/incoming.named":12,"./detripler/map":13,"./detripler/multi.named":14,"./detripler/outgoing.blank":15,"./detripler/outgoing.literal":16,"./detripler/outgoing.named":17}],19:[function(require,module,exports){
/**
 * Worker
 **/

var stringify = function (obj) {
    return JSON.stringify(obj, function (k, v) {
        if (typeof v == "function") {
            return v.toString();
        } else {
            return v;
        }
    });
};

// Transport object
var Local_interaction_interface = function(run) {
    this.run = run;
};

Local_interaction_interface.prototype.get_draft = function (id, cb) {
    cb(this.run.get_draft(id).slice());
};

Local_interaction_interface.prototype.get_concept = function (id, cb) {
    cb(this.run.get_concept(id).slice());
};

Local_interaction_interface.prototype.set_draft = function (id, draft, cb) {
    cb(this.run.modify_draft(id, draft));
};

var Internal = function () {
    this.state = "free";
    this.fns = {};
};

Internal.prototype.learn = function (id ,fn) {
    // Todo learn
    this.fns[id] = fn;
};

Internal.prototype.run = function (id, run, cb) {
    if (this.state == "free") {
        this.state = "occupied";
        this.fns[id](run.triples, new Local_interaction_interface(run), function(results) {
            cb(results);
        });
    }
};

Internal.prototype.knows = function (id) {
    return this.fns.hasOwnProperty(id);
};

Internal.prototype.get_state = function () {
    return this.state;
};

module.exports = Internal;
},{}],20:[function(require,module,exports){
(function (global){
/**
 * Singleton worker group creation. Needs to be set once.
 **/

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), plugin_name = require("../../const/general_plugin.js").name, W = require("./worker"), Internal = require("./internal");
var log = require("../../logger")("Job_dist");

var defaults = {
    n_cores: -1,
    worker_path: "./",
    concepts: function () {

    }
};

var Job_distributer = function (opt) {
    this._opt = $.extend(true, {}, defaults, opt);
    var _n_cores = (this._opt.n_cores <= 0) ? navigator.hardwareConcurrency - 1 : this._opt.n_cores;
    if (!_n_cores)
        _n_cores = 0;

    this.workers = [];
    for (var i = 0; i < _n_cores; i++) {
        this.workers.push(new W(this._opt.worker_path + plugin_name + "_worker.js")); // New worker here
    }

    this.internal = new Internal();
};

Job_distributer.prototype.learn = function (id, fn, worker) {
    if (!this.internal.knows(id)) {
        if (worker) {
            for (var i = 0; i < this.workers.length; i++) {
                this.workers[i].learn(id, fn);
            }
        }
        this.internal.learn(id, fn)
    }
};

Job_distributer.prototype.distribute_run = function (run, cb) {
    var that = this;
    run.on("done", function () {
        if (!run.cleaned) {
            run.cleaned = true;
            for (var j = 0; j < that.workers.length; j++) {
                that.workers[j].clear_data_of(run.id);
            }
        }
        log("Detripling done.")
        if (cb)
            cb(run);
    });
    if (run.triples) {

        // start detripling process
        this._distribute_run_help(run, null);
    }
};

Job_distributer.prototype._distribute_run_help = function (run) {
    var that = this;
    if (!run.is_done()) {

        // On main
        if (this.internal.get_state() == "free") {
            var detripler = run.get_next_detripler(false);
            if (detripler) {
                this.internal.run(detripler.id, run, function (r, t, i, d) {
                    return function (result) {
                        i.state = "free";
                        r.set_draft(d, result);
                        t._distribute_run_help(r);
                    }
                }(run, that, this.internal, detripler))
            }
        }

        // On worker
        for (var i = 0; i < this.workers.length; i++) {
            if (this.workers[i].get_state() == "free") {
                var w_detripler = run.get_next_detripler(true);
                if (w_detripler) {
                    var do_on_worker = function (r, t, w, d) {
                        return function () {
                            w.run(d.id,
                                r,
                                function (result) {
                                    w.state = "free";
                                    r.set_draft(d, result);
                                    t._distribute_run_help(r);
                                });
                        }
                    }(run, that, this.workers[i], w_detripler);

                    if (!this.workers[i].has_triples_for(run)) {
                        this.workers[i].set_triples_for(run, do_on_worker);
                    } else {
                        do_on_worker();
                    }
                }
            }
        }
    }
};

Job_distributer.prototype.destroy = function (cb) {
    for (var i = 0; i < this.workers.length; i++) {
        this.workers[i].terminate();
    }
    this.internal = null;
};

var instance = null;

module.exports = {
    get: function () {
        if (!instance)
            instance = new Job_distributer();
        return instance;
    },
    set: function (opt) {
        if (instance)
            instance.destroy();
        instance = new Job_distributer(opt);
    }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../const/general_plugin.js":3,"../../logger":41,"./internal":19,"./worker":21}],21:[function(require,module,exports){
/**
 * Worker
 **/
var e_ext = require("../../util/event_obj_extender");

var stringify = function (obj) {
    return JSON.stringify(obj, function (k, v) {
        if (typeof v == "function") {
            return v.toString();
        } else {
            return v;
        }
    });
};

var worker_run_id_counter = 0;

var Worker_wrap = function (path) {
    this.state = "free";
    this.worker = new Worker(path);
    this.triple_history = {};
    return e_ext(this);
};

Worker_wrap.prototype.set_triples_for = function (run, cb) {
    this.triple_history[run.id] = true;
    this.worker.postMessage({cmd: 'set', run_id: run.id, triples: stringify(run.triples)});
    if (cb)
        cb();
};

Worker_wrap.prototype.learn = function (fn_id, fn) {
    this.worker.postMessage({cmd: 'learn', fn_id: fn_id, fn: stringify(fn)});
};

Worker_wrap.prototype.run = function (fn_id, run, cb) {
    if (this.state == "free") {
        this.state = "occupied";
        var worker_run_id = worker_run_id_counter++;
        var that = this;
        this.worker.addEventListener('message', function (w_r_id, r) {
            return function (e) {
                if (e.data.worker_run_id == w_r_id) {
                    switch (e.data.cmd) {
                        case "get_concept":
                            that.worker.postMessage({cmd: 'concept', concept: r.get_concept(e.data.concept_id)});
                            break;
                        case "get_draft":
                            that.worker.postMessage({cmd: 'draft', draft: r.get_draft(e.data.detripler_id)});
                            break;
                        case "set_draft":
                            that.worker.postMessage({cmd: 'draft_set', draft: r.modify_draft(e.data.detripler_id, e.data.draft)});
                            break;
                        case "done":
                            var parsed_results = e.data.results ? e.data.results : null;
                            cb(parsed_results);
                            that.worker.removeEventListener(this);
                            break;
                        default:
                            break;
                    }
                }
            }
        }(worker_run_id, run));
        this.worker.postMessage({cmd: 'run', fn_id: fn_id, run_id: run.id, worker_run_id: worker_run_id});
    }
};

Worker_wrap.prototype.get_state = function () {
    return this.state;
};

Worker_wrap.prototype.has_triples_for = function (run) {
    return this.triple_history.hasOwnProperty(run.id);
};

Worker_wrap.prototype.clear_data_of = function (run) {
    this.worker.postMessage({cmd: 'clear', run_id: run.id});
    delete this.triple_history[run.id];
};

module.exports = Worker_wrap;
},{"../../util/event_obj_extender":52}],22:[function(require,module,exports){
var log = require("./../logger")("Detripler_manager"), Structure = require("./structure"), Jobs = require("./jobs/jobs"), Run = require("./run");
var detriplers = require("./detriplers.js"), Base_detripler = require("./scheme");

var defaults = {
    detriplers: detriplers
    //jobs: {}
};

var Manager = function (opt) {
    this._opt = $.extend(true, {}, defaults, opt);
    if (this._opt.jobs)
        Jobs.set(this._opt.jobs);
    this.jobs = Jobs.get();
    var keys = Object.keys(this._opt.detriplers);
    for (var i = 0; i < keys.length; i++) {
        var detripler = this._opt.detriplers[keys[i]];
        if (!detripler.derived_from_base) {
            detripler = this._opt.detriplers[keys[i]] = $.extend(true, new Base_detripler(keys[i]), detripler);
        }
        this.jobs.learn(detripler.id, detripler.fn, detripler.worker);
    }
    this.structure = new Structure(this._opt.detriplers);
};

Manager.prototype.detriple = function (triples, concepts, structure, cb) {
    if (!structure)
        structure = this.structure;
    var run = new Run(triples, concepts, structure), that = this;
    this.jobs.distribute_run(run, cb);
    return run;
};

Manager.prototype.get_detriplers = function () {
    return this._opt.detriplers;
};

module.exports = Manager;
},{"./../logger":41,"./detriplers.js":18,"./jobs/jobs":20,"./run":23,"./scheme":24,"./structure":25}],23:[function(require,module,exports){
var log = require("./../logger")("Detripler_run"), e_ext = require("../util/event_obj_extender");

var run_id_counter = 0;

var Detripling_run = function (triples, concepts, structure) {
    this.triples = triples;
    this.concepts = concepts;
    this.structure = structure;
    this.id = run_id_counter++;
    this.d_keys = structure.d_keys.slice();
    this._detripler_done_history = {"_": true};
    this.results = {};
    return e_ext(this);
};

Detripling_run.prototype.get_next_detripler = function (worker_flag) {
    var next = null;
    for (var n = 0; (n < this.d_keys.length) && (next == null); n++) {
        var t = this.structure.cy.$("#" + this.d_keys[n]), parents_ready = true, parents = t.incomers("node");
        for (var j = 0; ((j < parents.length) && parents_ready); j++) {
            var p_id = parents[j].id();
            if (this._detripler_done_history[p_id] == undefined) {
                parents_ready = false;
            }
        }

        // Only get fitting detripler. Does it need to be computable on workers? Are the parents done?
        if (parents_ready && (!worker_flag || this.structure.detriplers[this.d_keys[n]].worker)) {
            next = this.d_keys[n];
            this.d_keys.splice(n, 1);
        }
    }
    return this.structure.detriplers[next];
};

Detripling_run.prototype.set_draft = function (detripler, draft) {
    this.results[detripler.id] = draft;
    this._detripler_done_history[detripler.id] = true;
    if(this.is_done()) {
        this.trigger("done");
    }
};

Detripling_run.prototype.modify_draft = function (id, draft) {
    this.results[id] = draft;
    this._detripler_done_history[id] = true;
    if(this.is_done()) {
        this.trigger("done");
    }
};

Detripling_run.prototype.get_draft = function (id) {
    if (this.results[id]) {
        return this.results[id];
    } else {
        log("No draft for " + id + " found.");
        return null;
    }
};

Detripling_run.prototype.get_concept = function (id) {
    if (this.concepts[id]) {
        return this.concepts[id];
    } else {
        log("No concept for " + id + " found.");
        return [];
    }
};

Detripling_run.prototype.is_done = function () {
    return Object.keys(this._detripler_done_history).length == this.structure.d_keys.length + 1;
};

module.exports = Detripling_run;
},{"../util/event_obj_extender":52,"./../logger":41}],24:[function(require,module,exports){
(function (global){
var templating = require("../templating"), CSS = require("../const/css"), Handlebars = (typeof window !== "undefined" ? window['Handlebars'] : typeof global !== "undefined" ? global['Handlebars'] : null);

var Detripler = function (id) {
    this.derived_from_base = true;
    this.id = id;
    this.parents = [];
    this.fn = function (triples, transport, cb) {
        console.log("Base function called for " + triples);
        cb(triples);
    };
    // Use template by id
    // OR ..
    this.template_id = "tiles.default";
    // .. use this templating function
    this.templating_fn = function (draft, triples) {
        var divs = [], template;
        if (this.template) {
            if (this.compiled_template) {
                template = this.compiled_template;
            } else {
                this.compiled_template = Handlebars.compile(this.template);
                template = Handlebars.compile(this.template);
            }
        } else {
            if (this.template_id) {
                template = templating[this.template_id];
            } else {
                template = templating["tiles.default"];
            }
        }
        if (draft) {
            for (var i = 0; i < draft.length; i++) {
                var div = $(template({CSS: CSS, data: {draft: draft[i], detripler: this}}));
                div.data("draft_data", draft[i]);
                div.data("post_view_cbs", []);
                div.data("type", this.id);
                divs.push(div);
            }
        }
        return divs;
    };
    this.worker = true;
};

module.exports = Detripler;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../const/css":2,"../templating":51}],25:[function(require,module,exports){
(function (global){
var log = require("./../logger")("Detripler_structure"), cytoscape = (typeof window !== "undefined" ? window['cytoscape'] : typeof global !== "undefined" ? global['cytoscape'] : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../logger":41}],26:[function(require,module,exports){
(function (global){
var cytoscape = (typeof window !== "undefined" ? window['cytoscape'] : typeof global !== "undefined" ? global['cytoscape'] : null), CSS = require("./const/css"), templating = require("./templating"), log = require("./logger.js")("History");
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/css":2,"./layers/factory":32,"./logger.js":41,"./templating":51}],27:[function(require,module,exports){
var CSS = require("./../const/css.js"), templating = require('./../templating.js');

var Nav = function (fn, l, ele, c) {
    this._$html = $(templating["components.nav"]({CSS: CSS, class_in: c, label: l}));
    this._fn = fn;
    this._$html.on("click", this._fn);
    if (ele)
        ele.append(this._$html);
};

Nav.prototype.toggle_disable = function () {
    this._$html.toggleClass(CSS.disabled);
    if (this._$html.hasClass(CSS.disabled)) {
        this._$html.off("click", this._fn);
    } else {
        this._$html.on("click", this._fn)
    }
};

module.exports = Nav;
},{"./../const/css.js":2,"./../templating.js":51}],28:[function(require,module,exports){
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var CSS = require("./../const/css.js"), templating = require('./../templating.js'), e_ext = require("../util/event_obj_extender");

var Scroll = function (ele) {
    this._$html = ele;
    this._$html.addClass(CSS.scroll_box);
    this._$content = $(templating["components.scroll"]({CSS: CSS}));
    if (ele)
        ele.append(this._$content);
    var that = this;

    // Load if bottom of scroll is reached
    this._$html.scroll(function () {
        if ((that._$html.scrollTop() + that._$html.height() >= that._$content.outerHeight() - 5)) {
            that.add_row();
        }
    }.debounce(10));
    return e_ext(this);
};

Scroll.prototype.get_content_container = function () {
    return this._$content;
};

Scroll.prototype.add_row = function (cb) {
    var that = this;
    // Load after modification if we got more space
    this._observer = new MutationObserver(function (c) {
        return function (m, observer) {
            if (observer._start_height >= that._$content.height()) {
                // Timeout to make sure height was updated before adding next
                setTimeout(function(){that.trigger("get_more");}, 0);
            } else {
                if (observer._start_height == 0) {
                    observer._start_height = that._$content.height();
                    that.trigger("get_more");
                } else {
                    observer.disconnect();
                    if (c)
                        c();
                }
            }
        }
    }(cb));
    this._observer._start_height = this._$content.height();
    this._observer.observe(this._$content[0], {
        childList: true,
        subtree: false,
        attributes: false
    });
    that.trigger("get_more");
};

Scroll.prototype.fill_until_scrollbar = function () {
    var that = this;
    if (!this.has_scroll_bar()) {
        this.add_row(function () {
            that.fill_until_scrollbar();
        });
    }
};

Scroll.prototype.append = function (ele, cb) {
    this._$content.append(ele);
    if(cb)
        cb(ele)
};

Scroll.prototype.has_scroll_bar = function () {
    return this._$content.height() > this._$html.height() + 5;
};

Scroll.prototype.clear = function (callback) {
    this._$content.children().detach();
    if (callback)
        callback();
};

// Function to call if there is no more to add
Scroll.prototype.disable_observer = function () {
    this._observer.disconnect();
};

module.exports = Scroll;
},{"../util/event_obj_extender":52,"./../const/css.js":2,"./../templating.js":51}],29:[function(require,module,exports){
(function (global){
/**
 * Singleton info box creation.
 **/

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), CSS = require("./const/css.js"), U_layout = require("./util/layout.js");

var START_FADEOUT = 3000;

var Info = function () {
    this.timeout = null;
    this.unappended = true;
    this.$info = $("<div class=" + CSS.monolog + "></div>");
    var that = this;
    this._start_timer = function () {
        clearTimeout(that.timeout);
        that.timeout = setTimeout(function () {
            that.hide();
        }, START_FADEOUT);
    };
    this.$info.click(function () {
        clearTimeout(that.timeout);
        that.$info.removeClass(CSS.fadeIn);
    });
};

Info.prototype.append_to = function (ele) {
    $(ele).append(this.$info);
    this.unappended = false;
};

Info.prototype._add_message = function (msg) {
    var span = $("<span style='height: 40px'>" + msg + "</span>"), children = this.$info.children();
    if (U_layout.getTransitionSupport()) {
        switch (children.size()) {
            case 0:
                span.css("bottom", "-80px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
            case 1:
                span.css("bottom", "-40px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
            default:
                while (this.$info.children().size() >= 2) {
                    children.first().remove();
                }
                span.css("bottom", "-40px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
        }
    } else {
        switch (children.size()) {
            case 0:
            case 1:
                this.$info.append(span);
                break;
            default:
                while (this.$info.children().size() >= 2) {
                    children.first().remove();
                }
                this.$info.append(span);
                break;
        }
    }
};


Info.prototype.show = function (msg) {
    clearTimeout(this.timeout);
    var that = this;
    if (msg) {
        setTimeout(function () {
            that._add_message(msg);
            that._start_timer(that);
        }, 500);
    }
    setTimeout(function () {
        that.$info.addClass(CSS.fadeIn);
    }, 50);
};

Info.prototype.hide = function () {
    this.$info.removeClass(CSS.fadeIn);
};

var instance = new Info();

module.exports = instance;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/css.js":2,"./util/layout.js":53}],30:[function(require,module,exports){
module.exports={
  "filter" : "Filtern: ",
  "sorter" : "Sortieren: "
}
},{}],31:[function(require,module,exports){
module.exports={
  "filter" : "Filter",
  "sorter" : "Sort: ",
  "sorter_default" : "by ...",
  "back" : "back",
  "history" : "history",
  "close" : "close",
  "sort.alphabet" : "alphabetically",
  "sort.random" : "random",
  "sort.weight" : "tile type",
  "filter.in" : "only subjects",
  "filter.out" : "only objects",
  "filter_options" : "+ condition",
  "stop_remote": "stop remote loading",
  "more": "more",
  "n_tiles": "tiles",
  "and": "and",
  "empty": "No data",
  "no_browse": "Browsing for this tile type disabled. Type: "
}
},{}],32:[function(require,module,exports){
/**
 * Layer factory
 **/

var Util = require("./../util/misc"), log = require("./../logger.js")("LayerFactory"), event_obj_extender = require('../util/event_obj_extender');
var store = require('../store').get();

var Factory = {};

// Object to hold layer types
Factory.layer_types = {};

Factory.addLayerTypes = function (constructors) {
    var keys = Object.keys(constructors);
    for (var i = 0; i < keys.length; i++) {
        var type = keys[i];
        var Layer = constructors[type];
        Factory.layer_types[type] = Layer;
        Layer.prototype.type = type;
    }
};

var constructors = {
    Query: require('./types/query_layer'),
    Literal: require('./types/literal_node_layer'),
    Blank: require('./types/blank_node_layer'),
    Pattern: require('./types/pattern_layer'),
    NamedNode: require('./types/named_node_layer')
};

Factory.addLayerTypes(constructors);

Factory.make = function (synopsis, input, type) {
    if (!type)
        if (input.interfaceName) {
            type = input.interfaceName;
        } else {
            log("Factory couldn't extract input type.");
            return null;
        }
    if (this.layer_types[type]) {
        var layer = new this.layer_types[type](synopsis.detriple_manager, synopsis.decorator_manager, synopsis.msg, input);

        // Remote loading
        layer.on("request_remote", function (plugin, l) {
                return function (querys, cb, fail) {
                    var num_of_remote_requests = plugin.get_remote_count() * querys.length;
                    for (var i = 0; i < querys.length; i++) {
                        var bar = plugin.progress.make_n_add_bar(l.label + "_" + (i + 1), plugin.get_remote_count());
                        bar.do_partial_progress(0);

                        // Define an interrupt flag
                        var flag = event_obj_extender({});
                        flag.interrupt = false;

                        // Stop the progress bar on destroyed layer
                        var on_destroy_stop = function (b, fl) {
                            return function () {
                                fl.interrupt = true;
                                fl.trigger("interrupt");
                                b.do_stop();
                            };
                        }(bar, flag);
                        l.once("destroyed", on_destroy_stop);

                        // Stop listening for "destroyed" on layer if the bar is done. Progress stopping isn't needed anymore.
                        bar.once("done", function (_l, _on_destroy_stop) {
                            return function () {
                                _l.off("destroyed", _on_destroy_stop);
                            }
                        }(l, on_destroy_stop));

                        // Only execute on remote of layer is still alive
                        if (!flag.interrupt) {
                            plugin.execute_on_remote_with_limits(querys[i], 0, flag,

                                // On success of a remote execution try to work with the result set
                                function (b, fl) {
                                    return function (resp, remote_num, partial) {
                                        log("Got " + resp.results.bindings.length + " triples from remote query " + querys[i]);

                                        // Only trigger callback if layer is still alive
                                        if (!fl.interrupt) {
                                            b.do_partial_progress(remote_num);
                                            if (cb)
                                                cb(resp, b, remote_num, partial);
                                        }
                                    }
                                }(bar, flag),

                                // On fail of a remote execution add warning effect to progress bar and do a partial progress
                                function (b) {
                                    return function (e, remote_num) {
                                        b.do_warn(remote_num);
                                        b.do_progress(remote_num);
                                        if (fail)
                                            fail(e);
                                    }
                                }(bar));
                        }
                    }
                    if (querys.length > 0)
                        plugin.progress.show();
                }
            }(synopsis, layer)
        );
        layer.make_arguments = arguments;
        return layer;
    }
    else {
        log("Layer type " + type + " not defined.");
        return null;
    }
}
;

module.exports = Factory;

require("./layer");
},{"../store":48,"../util/event_obj_extender":52,"./../logger.js":41,"./../util/misc":54,"./layer":33,"./types/blank_node_layer":35,"./types/literal_node_layer":36,"./types/named_node_layer":37,"./types/pattern_layer":38,"./types/query_layer":39}],33:[function(require,module,exports){
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
},{"../const/css":2,"../const/general_plugin":3,"../html_obj/nav":27,"../html_obj/scroll":28,"../info":29,"../layout_engines/flexbox":40,"../logger.js":41,"../templating":51,"../util/event_obj_extender":52,"../util/misc":54,"./factory":32,"./triple_set":34}],34:[function(require,module,exports){
var e_ext = require("../util/event_obj_extender");

var Triple_set = function () {
    this.val = [];
    return e_ext(this)
};

Triple_set.prototype.add = function (triple) {
    if (triple instanceof Array) {
        this.val = this.val.concat(triple);
    } else {
        this.val.push(triple);
    }
    this.trigger("updated", this.val, triple);
};


Triple_set.prototype.get = function (index) {
    if (!index) {
        return this.val;
    } else {
        return this.val[index];
    }
};

Triple_set.prototype.clear = function (index) {
    this.val = [];
};

module.exports = Triple_set;
},{"../util/event_obj_extender":52}],35:[function(require,module,exports){
/**
 * Layer
 **/

var Blank_node_layer = function () {

};

module.exports = Blank_node_layer;
},{}],36:[function(require,module,exports){
/**
 * Layer
 **/

var Literal_node_layer = function () {

};

module.exports = Literal_node_layer;
},{}],37:[function(require,module,exports){
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
},{"../../const/css":2,"../../info":29,"../../logger.js":41,"../../store":48,"../../templating":51,"../layer":33}],38:[function(require,module,exports){
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
},{"../../const/css":2,"../../info":29,"../../logger.js":41,"../../store":48,"../../templating":51,"../layer":33}],39:[function(require,module,exports){
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
},{"../../const/css":2,"../../info":29,"../../logger.js":41,"../../store":48,"../../templating":51,"../layer":33}],40:[function(require,module,exports){
var CSS = require("../const/css");

var defaults = {
    batch_size: 1
};

var Flex_layout = function (box, footer, msg, opt) {
    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this._$footer = footer;
    this._ele = box.get_content_container();
    this.box = box;
    this._msg = msg;
    this.divs = [];
    this.paint_index = 0;
    var that = this;
    this.box.on("get_more", function () {
        if (that.paint_index < that.divs.length) {
            that.paint_next();
        } else {
            if (that.paint_index == 0) {
                that.set_footer(0);
            }
            that.box.disable_observer();
        }
    });
    this._backup_divs = [];
};

Flex_layout.prototype.add = function (divs) {
    this.divs = this.divs.concat(divs);
    if (!this.box.has_scroll_bar()) {
        this.box.fill_until_scrollbar();
    }
    this._backup_divs = this.divs;
};

Flex_layout.prototype.paint_next = function () {
    if (this.paint_index < this.divs.length) {
        var end_index = Math.min(this.paint_index + this._opt.batch_size, this.divs.length);
        var divs = [];
        while (this.paint_index < end_index) {
            divs.push(this.divs[this.paint_index]);
            this.paint_index++;
        }
        if (!this._ele.hasClass(CSS.fadeIn))
            this._ele.addClass(CSS.fadeIn);
        this.box.append(divs, function (d) {
            for (var i = 0; i < d.length; i++) {
                d[i].trigger("appended");
            }
        });

        //show more tile number
        var unpainted_number = this.divs.length - this.paint_index;
        this.set_footer(this.paint_index, unpainted_number);
    } else {
        this.box.disable_observer();
    }
};

Flex_layout.prototype.set_footer = function (painted_number, unpainted_number) {
    if (unpainted_number) {
        this._$footer.html((painted_number) + " " + this._msg.get("n_tiles") + " " + this._msg.get("and") + " " + unpainted_number + " " + this._msg.get("more"));
    } else {
        this._$footer.html((painted_number) + " " + this._msg.get("n_tiles"));
    }
};

Flex_layout.prototype.clear = function (callback) {
    this.paint_index = 0;
    this.box.clear(callback);
};


Flex_layout.prototype.sort = function (sorter) {
    this.divs.sort(sorter);
    var that = this;
    this.clear(function() {
        setTimeout(function() {that.box.fill_until_scrollbar();}, 0)
    });
};

Flex_layout.prototype.filter = function (filter_functions) {
    var divs = this._backup_divs;
    for (var i = 0, len = filter_functions.length; i < len; i++) {
        var tmp = [];
        for (var j = 0, jlen = divs.length; j < jlen; j++) {
            var tile = $(divs[j]);
            if (filter_functions[i](tile)) {
                tmp.push(tile);
            }
        }
        divs = tmp;
    }
    this.divs = divs;
    var that = this;
    this.clear(function() {
        setTimeout(function() {that.box.fill_until_scrollbar();}, 0)
    });
};

module.exports = Flex_layout;
},{"../const/css":2}],41:[function(require,module,exports){
(function (global){
/**
 * Wrapper for logger creation
 **/

(typeof window !== "undefined" ? window['bows'] : typeof global !== "undefined" ? global['bows'] : null);
var plugin_prefix = require("./const/general_plugin.js").prefix;

var loggers = {};

module.exports = function (str) {
    var id;
    if (str) {
        id = plugin_prefix + str;
    } else {
        id = plugin_prefix;
    }
    if (!loggers[id]) {
        loggers[id] = bows(id);
    }
    return loggers[id];
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/general_plugin.js":3}],42:[function(require,module,exports){
var log = require("./logger")("Language");

var Languages = function (language) {
    this.languages = {
        en: require("./languages/en.json"),
        de: require("./languages/de.json")
    };
    this.set_language(language);
};

Languages.prototype.get = function (id) {
    if (this.languages[this._cur][id]) {
        return this.languages[this._cur][id];
    } else {
        log("Couldn't find " + id + " in language object.");
        return id;
    }
};

Languages.prototype.set = function (lang, id, val) {
    this.languages[lang][id] = val;
};

Languages.prototype.set_language = function (language) {
    this._cur = this.languages[language] ? language : "en";
};

Languages.prototype.get_language = function () {
    return this._cur;
};

module.exports = Languages;
},{"./languages/de.json":30,"./languages/en.json":31,"./logger":41}],43:[function(require,module,exports){
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
},{"./const/css":2,"./const/general_plugin":3,"./history":26,"./html_obj/nav":27,"./logger.js":41,"./templating":51,"./util/event_obj_extender":52}],44:[function(require,module,exports){
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
},{"./const/css":2,"./history":26,"./logger.js":41,"./overlay":43,"./store":48,"./templating":51}],45:[function(require,module,exports){
(function (global){
/**
 * Singleton Progress box creation.
 **/

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), CSS = require("./const/css.js"), templating = require('./templating'), e_ext = require("./util/event_obj_extender");

var DONE_DELETE = 1200, DONE_FADE = 1000;

var Progress_Bar = function (label, progress_num) {
    this._$html = $(templating["progress_bar"]({CSS: CSS, label: label}));
    this._progress = Array.apply(null, new Array(progress_num)).map(Number.prototype.valueOf, 0);
    this._partial = Array.apply(null, new Array(progress_num)).map(Number.prototype.valueOf, 1);
    this._$progress_bar = this._$html.find("." + CSS.progress_bar);
    return e_ext(this);
};

Progress_Bar.prototype.get_progress = function () {
    var progress_n = 0;
    for (var i = 0; i < this._progress.length; i++) {
        progress_n += this._progress[i];
    }
    return progress_n;
};

Progress_Bar.prototype.get_max_progress = function () {
    return this._progress.length;
};

Progress_Bar.prototype.do_progress = function (index) {
    this._progress[index] = 1;
    var q = this.get_progress() / this.get_max_progress();
    this._$progress_bar.width(q * 100 + "%");
    if (q == 1) {
        this.done();
    }
};

Progress_Bar.prototype.do_partial_progress = function (index) {
    this._progress[index] = 1 - (1 / (this._partial[index] += 0.25));
    var q = this.get_progress() / this.get_max_progress();
    this._$progress_bar.width(q * 100 + "%");
};

Progress_Bar.prototype.do_warn = function () {
    this._$progress_bar.addClass("progress-bar-warning");
};

Progress_Bar.prototype.do_stop = function () {
    this._$progress_bar.addClass("progress-bar-warning");
    this._$progress_bar.addClass("progress-bar-striped");
    this._$progress_bar.width("100%");
    this.done();
};

Progress_Bar.prototype.remove = function () {
    this._$html.remove();
};

Progress_Bar.prototype.done = function () {
    this.trigger("done");
};

var Progress = function () {
    this.unappended = true;
    this.bar_num = 0;
    this._$html = $(templating["progress"]({CSS: CSS}));
    // Remote & progress
    this._$progress_container = this._$html.find("." + CSS.progress_container);

    var that = this;
    this._$html.click(function () {
        setTimeout(function () {
            that.hide();
        }, 100);
    });
};

Progress.prototype.append_to = function (ele) {
    $(ele).append(this._$html);
    this.unappended = false;
};

Progress.prototype.make_n_add_bar = function (label, n) {
    var bar = new Progress_Bar(label, n), that = this;
    bar.on("done", function (bar) {
        return function () {
            that.bar_num--;
            if (that.bar_num == 0) {
                setTimeout(function () {
                    that.hide();
                }, DONE_FADE)
            }
            setTimeout(function () {
                bar.remove();
            }, DONE_DELETE)
        }
    }(bar));
    this.bar_num++;
    this._$progress_container.append(bar._$html);
    return bar;
};

Progress.prototype.show = function () {
    this._$html.addClass(CSS.fadeIn);
};

Progress.prototype.hide = function () {
    this._$html.removeClass(CSS.fadeIn);
};

var instance = new Progress();

module.exports = instance;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/css.js":2,"./templating":51,"./util/event_obj_extender":52}],46:[function(require,module,exports){
var e_ext = require("../util/event_obj_extender");

var max_url_length = 2000;

var Debounced_remote_loader = function (synopsis, query, url, fail) {
    this.synopsis = synopsis;
    this.query = query;
    this.values = [];
    this.value_map = {};
    this.cbs = {};
    this.fail = fail;
    this.url = url;
    this.query_length = encodeURIComponent(query).length;
    var that = e_ext(this);
    that.on("DoQuery", function () {
        that.run_on_remote();
    }.debounce(100));
    return that;
};

Debounced_remote_loader.dummy = "Filter_()";

Debounced_remote_loader.prototype.add_value = function (val, cb) {
    if (this.synopsis._opt.dyn_remote) {
        var encoded_uri_part_length = encodeURIComponent("<" + val + "> || ");
        // Ignore debounce if max length is reached
        if (this.query_length + encoded_uri_part_length.length > max_url_length) {
            this.run_on_remote();
        }

        // Add new to debounced query
        if (!this.value_map[val]) {
            this.value_map[val] = true;
            this.values.push(val);
            this.query_length += encoded_uri_part_length.length;
            if (!this.cbs[val])
                this.cbs[val] = [];
            this.cbs[val].push(cb);
            this.trigger("DoQuery");
        }
    } else {
        cb([]);
    }
};

Debounced_remote_loader.prototype.run_on_remote = function () {
    var that = this;
    if (that.values.length > 0) {
        var query_values = that.values.slice();
        this.synopsis.execute_on_remote(this.pop_query(), this.url, function (res) {
            var bindings = {};
            for (var i = 0; i < res.results.bindings.length; i++) {
                var val = res.results.bindings[i].value.value;
                if (!bindings[val])
                    bindings[val] = [];
                bindings[val].push(res.results.bindings[i]);
            }
            for (var j = 0; j < query_values.length; j++) {
                if (!bindings[query_values[j]]) {
                    for (var k = 0; k < that.cbs[query_values[j]].length; k++) {
                        that.cbs[query_values[j]][k]([]);
                    }
                } else {
                    for (var k = 0; k < that.cbs[query_values[j]].length; k++) {
                        that.cbs[query_values[j]][k](bindings[query_values[j]]);
                    }
                }
            }
        }, this.fail);
    }
};

Debounced_remote_loader.prototype.pop_query = function () {
    var values = this.values;
    this.query_length = encodeURIComponent(this.query).length;
    this.values = [];
    var replacement = "Filter (";
    for (var i = 0; i < values.length; i++) {
        delete this.value_map[values[i]];
        replacement += "?value=" + "<" + values[i] + ">";
        if (i < values.length - 1)
            replacement += " || "
    }
    replacement += ")";
    return this.query.replace(Debounced_remote_loader.dummy, replacement);
};

module.exports = Debounced_remote_loader;
},{"../util/event_obj_extender":52}],47:[function(require,module,exports){
(function (global){
/**
 * Singleton store local
 **/

var rdfstore = (typeof window !== "undefined" ? window['rdfstore'] : typeof global !== "undefined" ? global['rdfstore'] : null), $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), log = require("./../logger.js")("Remote");

/**
 * Remote loading for rdf data via describe queries.
 *
 * @param url Triple of parts of the service url. The join of the complete array should map to a query execution on the service. Consists of a tupel of strings where the query is to be inserted in between. Used for CORS.
 * @constructor
 * @param url
 */
var Remote = function (url) {
    if (url.length != 3) {
        throw Error("Url must be split in 3 parts. I) The service url ex: 'http://dbpedia.org/sparql' II) + III) The rest of the url where the query can be placed in between.");
    }
    this._service = url[0];
    this._exec_url = [url[1], url[2]];
};

/**
 * Creates the cors request object
 *
 * @param method
 * @param url
 * @returns {XMLHttpRequest}
 * @private
 */
Remote.prototype._createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if (typeof xhr.withCredentials !== "undefined") {

        // XMLHTTPRequest2 objects
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest !== 'undefined') {

        // IE workaround
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
        xhr = null;
    }
    return xhr;
};

Remote.prototype.get_service_name = function () {
    return this._service;
};

/**
 * Execute given query on sparql service via cors.
 *
 * @param query
 * @param cb
 * @param fail
 * @param flag
 */
Remote.prototype.execute = function (query, cb, fail, flag) {
    var xhr = this._createCORSRequest('GET', this._service + this._exec_url[0] + encodeURIComponent(query) + this._exec_url[1]), that = this;
    if (flag) {
        flag.on("interrupt", function() {
            log("Aborted remote query.");
            xhr.abort();
            flag.off("interrupt", this);
        });
    }
    xhr.onload = function () {
        if (this.status == 200 && this.readyState == 4 && this.responseText != "") {
            cb(JSON.parse(xhr.responseText));
        } else {
            log("There was an service error for query: " + query + " on backend: " + that._service, xhr);
            fail();
        }
    };
    xhr.onerror = function () {
        log("There was an transport error for query: " + query + " on backend: " + that._service, xhr);
        fail();
    };
    xhr.send();
};

var counter = 0;


/**
 * Execute given query on sparql service via yql. Fix YQL.
 * @param query
 * @param cb
 * @param fail
 */
//Remote.prototype.execute_yql = function (query, cb, fail) {
//    var success = false, cnt = counter++;
//    // Use cnt to stop callbackoverwriting on simultan calls
//    window["cbFunc" + cnt] = function (data, textStatus, jqXHR) {
//        // If we have something to work with...
//        if (data && data.query && data.query.results) {
//            success = true;
//            cb(data.query.results);
//        }
//
//        // Else, Maybe we requested a site that doesn't exist, and
//        // nothing returned.
//        else {
//            log('Nothing returned from getJSON.');
//            fail();
//
//            // Delete old callbackfunction
//            window["cbFunc" + cnt] = undefined;
//        }
//    };
//
//    // If no query was passed, exit.
//    if (!query) {
//        alert('No query was passed.');
//    }
//
//    // Take the provided url, and add it to a YQL query. Make sure you
//    // encode it!
//    var yql = 'http://query.yahooapis.com/v1/public/yql?q='
//        + encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="'
//        + query + '" and service="' + this._service) + '"&format=json';
//
//    // Request that YSQL string, and run a callback function.
//    // Pass a defined function to prevent cache-busting.
//    $.ajax({
//        type: 'post',
//        dataType: 'json',
//        url: yql,
//        success: window["cbFunc" + cnt],
//        error: function (jqXHR, textStatus, errorThrown) {
//            fail();
//        }
//    });
//};

module.exports = Remote;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../logger.js":41}],48:[function(require,module,exports){
(function (global){
/**
 * Singleton local rdf store. Needs to be set once.
 **/

var rdfstore = (typeof window !== "undefined" ? window['rdfstore'] : typeof global !== "undefined" ? global['rdfstore'] : null), $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), log = require("./logger.js")("Store"), RDFModel = window.RDFModel, Util = require("./util/misc.js");

var defaults = {
    "trigger_on_batch_loading": false,
    "rdfstore": {
        "persistent": false,
        "name": "local_rdf"
    }
};

var Parser = function(store) {
    this.store = store;
};

Parser.prototype.parse_to_graph = function(bindings, structure) {
    if (!structure) {
        structure = ["s", "p", "o"];
    }
    var graph = this.store.create_graph();
    for (var i = 0; i < bindings.length; i++) {
        var triple_data = [];
        for (var j = 0; j < structure.length; j++) {
            var atom = bindings[i][structure[j]];
            if (!atom.token)
                atom.token = atom.type; // RDFModel needs token attribute, not type attribute
            if (atom.token === "literal" || atom.token === "typed-literal") {
                atom.token = "literal";
                atom.value = Util.add_slashes(atom.value.toString()); // Escape quotes etc in literal values
            }
            triple_data[j] = RDFModel.buildRDFResource(atom, null, this.store.get_engine(), {blanks: {}, outCache: {}});
        }
        graph.add(this.store.create_triple.apply(this.store, triple_data));
    }
    return graph;
};


/**
 * Implements interface to local rdf store.
 *
 * @param opt
 * @constructor
 */
var Store = function (opt) {
    require("./util/event_obj_extender.js")(this);
    var that = this;
    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this.parser = new Parser(this);
    that.init_dfd = $.Deferred();
    rdfstore.create(this._opt.rdfstore, function (err, store) {

        // common name-spaces like rdf, rdfs, foaf, etc
        store.registerDefaultProfileNamespaces();
        that._local_store = store;
        that.init_dfd.resolve();
        if (that._opt.trigger_on_batch_loading) {
            store.setBatchLoadEvents(true);
        }
    });
};

/**
 * Returns initialization promise statement
 * @returns {*}
 */
Store.prototype.init_done = function () {
    return this.init_dfd.promise();
};

Store.prototype.create_graph = function () {
    return this._local_store.rdf.createGraph.apply(this._local_store, arguments);
};

Store.prototype.create_triple = function () {
    return this._local_store.rdf.createTriple.apply(this._local_store, arguments)
};

Store.prototype.get_engine = function () {
    return this._local_store.engine;
};

Store.prototype.insert_serialized_str = function (str, format, cb) {
    var parser = this._local_store.engine.rdfLoader.parsers[format];
    var that = this;
    //synopsis.store._local_store.engine.rdfLoader.tryToParse(parser, null, str, null, function(e, triples) {
    //    synopsis.store._local_store.insert(that.parser.parse_to_graph(triples, ["subject", "predicate", "object"]), cb);
    //});
    this._local_store.load(format, str, function (err, results) {
        if (cb)
            cb(err, results);
    });
};

/**
 *
 */
Store.prototype.subscribe = function () {
    this._local_store.subscribe.apply(this._local_store, arguments);
};

/**
 *
 */
Store.prototype.unsubscribe = function () {
    this._local_store.unsubscribe.apply(this._local_store, arguments);
};

/**
 *
 */
Store.prototype.startObservingNode = function () {
    this._local_store.startObservingNode.apply(this._local_store, arguments);
};

/**
 *
 */
Store.prototype.stopObservingNode = function () {
    this._local_store.stopObservingNode.apply(this._local_store, arguments);
};

/**
 *
 */
Store.prototype.startObservingQuery = function () {
    this._local_store.startObservingQuery.apply(this._local_store, arguments);
};

/**
 *
 */
Store.prototype.stopObservingQuery = function () {
    this._local_store.stopObservingQuery.apply(this._local_store, arguments);
};

/**
 * Inserts given triples into the store.
 *
 * @param bindings
 * @param structure Array of keys in binding
 * @param cb
 */
Store.prototype.insert_triples = function (bindings, structure, cb) {
    this.insert_graph(this.parser.parse_to_graph(bindings, structure), cb);
};

Store.prototype.insert_graph = function (graph, cb) {
    //this._local_store.insert(graph, function () {
    //    cb(d);
    //});
    // rdfstore-js bug workaround (can't handle multiple executions at once)
    var that = this;
    if (!this._execQueue) {
        this._execQueue = [];
        this._execNext = function () {
            if (that._execQueue.length >= 1) {
                var fn = that._execQueue[0];
                fn(function (c) {
                    that._execQueue.shift();
                    that._execNext();
                });
            }
        };
    }
    this._execQueue.push(function (g, c) {
        return function () {
            that._local_store.insert(g, function () {
                c.apply(null, arguments);
            });
        }
    }(graph, cb));
    if (this._execQueue.length == 1) {
        this._execNext();
    }
//! rdfstore-js bug workaround (can't handle multiple executions at once)
};

//Store.prototype.insert_by_query = function (bindings, structure, cb) {
//    // rdfstore-js bug workaround (can't handle multiple executions at once)
//    var that = this;
//    if (!this._execQueue) {
//        this._execQueue = [];
//        this._execNext = function () {
//            if (that._execQueue.length >= 1) {
//                var fn = that._execQueue[0];
//                fn(function (c) {
//                    that._execQueue.shift();
//                    that._execNext();
//                    c();
//                });
//            }
//        };
//    }
//    var query = this._generateInsertionQuery(bindings, structure);
//    this._execQueue.push(function (q, d) {
//        return function (c) {
//            that._local_store.execute(q, function () {
//                c(d);
//            });
//        }
//    }(query, cb));
//    if (this._execQueue.length == 1) {
//        this._execNext();
//    }
////! rdfstore-js bug workaround (can't handle multiple executions at once)
//};
//
///**
// * Generate insertion SPARQL command to use for the store out of json results returned by backend.
// *
// * @private
// * @method _generateInsertionQuery
// * @param bindings JSON result
// */
//Store.prototype._generateInsertionQuery = function (bindings, structure) {
//    if (!structure) {
//        structure = ["s", "p", "o"];
//    }
//    var type_map = { subject : "s", predicate: structure[1], object: structure[2]};
//    var insertionQuery = "INSERT DATA {";
//    $.each(bindings, function (i, val) {
//        if (val[type_map.subject] === undefined) {
//            log("Resultset disfigured.");
//        } else if (val[type_map.subject].type === "uri") {
//            insertionQuery += "<" + val[type_map.subject].value + "> ";
//        } else {
//            // TODO BlankNodes
//            log("TODO BLANKNODE");
//            insertionQuery += "<" + val[type_map.subject].value + "> ";
//        }
//        insertionQuery += "<" + val[type_map.subject].value + "> ";
//        if (val[type_map.object].type === "uri") {
//            insertionQuery += "<" + val[type_map.object].value + ">. ";
//        } else if (val[type_map.object].type === "literal") {
//            insertionQuery += '"' + encodeURIComponent(val[type_map.object].value) + '". ';
//        } else if (val[type_map.object].type === "typed-literal") {
//            // TODO typed-literals
//            insertionQuery += '"' + encodeURIComponent(val[type_map.object].value) + '". ';
//        }
//    });
//    insertionQuery += "}";
//    return insertionQuery;
//};

/**
 * Execute given query on store.
 * @param query
 * @param cb
 * @param fail
 */
Store.prototype.execute = function (query, cb, fail) {
    this._local_store.execute(query, function (err, results) {
        if (err && fail) {
            fail(err, results);
        }
        if (cb)
            cb(err, results);

    });
};

Store.prototype.clear = function () {
    this._local_store.clear();
};

// Singleton instance
var instance = {}, cur = 0;
module.exports = {
    get: function() {
        if (!instance.store)
            instance.store = new Store();
        return instance;
    },
    set : function (opt) {
        if (instance.store)
            if (instance.store.init_done() == "resolve") {
                instance.store.clear();
            } else {
                instance.store.init_dfd.reject();
            }
        instance.store = new Store(opt);
    }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./logger.js":41,"./util/event_obj_extender.js":52,"./util/misc.js":54}],49:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
(typeof window !== "undefined" ? window['rdfstore'] : typeof global !== "undefined" ? global['rdfstore'] : null);
var plugin_name = require("./const/general_plugin").name;
var GUID = 0, synopsis_instances = [], log = require("./logger")();
var Util = require("./util/misc"), Remote = require("./remote/remote"), info = require('./info'), progress = require('./progress');
var Overlay_m = require("./overlay_manager"), RDFModel = window.RDFModel, Layer_factory = require("./layers/factory");
var Msg = require("./msg"), History = require("./history");
var Detripler_manager = require("./detripling/manager"), Decorator_manager = require("./decorating/manager");

//var defaults = require("./defaults.json");
var defaults = {
    "lang": "en",
    "dyn_remote": true,
    "remote_batch_size": 9999,
    "store": {},
    "detripling": {},
    "decorating": {},
    "remote": [
        [
            "http://dbpedia.org/sparql",
            "?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=",
            "&format=application%2Fsparql-results%2Bjson&timeout=300000"
        ]
    ]
};

/**
 * Extend jQUery selector for contains
 */
$.expr[":"].containsInsensitive = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/**
 * Main plugin class
 *
 * @param ele Parent element
 * @param opt Options object
 * @constructor
 * @param cb Callback on init
 */
var Synopsis = function (ele, opt, cb) {
    // use element as selector string
    if (typeof ele === 'string') {
        ele = document.querySelector(ele);
    }
    if (!ele) {
        ele = $("<div></div>");
    }
    this._$ele = $(ele);
    if (info.unappended)
        info.append_to(ele);
    this.info = info;
    this.css = require("./const/css");

    if (progress.unappended)
        progress.append_to(ele);
    this.progress = progress;

    this.init_dfd = $.Deferred();

    this.rdf = RDFModel.rdf;

    // options
    if (opt) {
        this._opt = $.extend(true, {}, defaults, opt);
    } else {
        this._opt = $.extend(true, {}, defaults);
    }

    this.msg = new Msg(this._opt.lang);

    this.detriple_manager = new Detripler_manager(this._opt.detripling);
    this.decorator_manager = new Decorator_manager(this._opt.decorating, this);
    this.id = GUID++;

    this.remote = [];
    if (this._opt.remote) {
        for (var i = 0; i < this._opt.remote.length; i++) {
            this.remote.push(new Remote(this._opt.remote[i]));
        }
    }

    var store_opt = Util.opt_get(this._opt, "store"), Store = require("./store");
    if (store_opt)
        Store.set(store_opt);
    this.store_wrap = Store.get();
    var that = this;
    $.when(this.store_wrap.store.init_done()).done(function () {
            that.init_dfd.resolve();
            if (cb)
                cb(that);
        }
    );

    this._history = new History(this);

    var overlay_m_opt = Util.opt_get(that._opt, "overlay_manager");
    that.overlay_manager = new Overlay_m(this._history, this.msg, that._$ele, overlay_m_opt);

    synopsis_instances[this.id] = this; // associate via id
};

Synopsis.Layer_factory = Layer_factory;

Synopsis.prototype.init_done = function () {
    return this.init_dfd.promise();
};

// Data insertion

Synopsis.prototype.fetch = function (uri, cb, fail) {
    var that = this;
    for (var i = 0; i < this.remote.length; i++) {
        this.remote[i].execute("DESCRIBE " + uri, function (resp) {
            that.store_wrap.store.insert_triples(resp.results.bindings);
            cb(resp);
        }, fail);
    }
};

Synopsis.prototype.execute_on_remote = function (query, url, cb, fail) {
    var use_predef_remotes = false, did_remote = false;
    if (!url || url == "" || url == null) {
        use_predef_remotes = true;
    }

    for (var i = 0; i < this.remote.length; i++) {
        if (use_predef_remotes || url == this.remote[i].get_service_name()) {
            did_remote = true;
            this.remote[i].execute(query,
                function (remote_num) {
                    return function (resp) {
                        if (cb)
                            cb(resp, remote_num);
                    }
                }(i),
                function (remote_num) {
                    return function (e) {
                        if (fail)
                            fail(e, remote_num);
                    }
                }(i));
        }
    }
    if (!did_remote)
        info.show("Remote service isn't added to remote backends. Execute on remote failed.");
};

Synopsis.prototype.execute_on_remote_with_limits = function (query, p_query_num, flag, cb, fail) {
    var tmp_query = query + " LIMIT " + this._opt.remote_batch_size + " OFFSET " + p_query_num * this._opt.remote_batch_size, that = this;
    this.execute_on_remote(tmp_query, null,
        function (q, fl, c, f) {
            return function (resp, remote_num) {
                if (resp.results.bindings.length > 0 && (!fl || !fl.interrupt)) {
                    if (resp.results.bindings.length == that._opt.remote_batch_size) {
                        setTimeout(function () {
                            that.execute_on_remote_with_limits(q, p_query_num + 1, fl, c, f)
                        }, 100);

                        // callback with response, number of remote service and partial true flag
                        c(resp, remote_num, true);
                    } else {

                        // callback with response, number of remote service and partial false flag
                        c(resp, remote_num, false);
                    }
                }
            }
        }(query, flag, cb, fail), fail, flag);
};

Synopsis.prototype.insert_file = function (file, cb) {
    var that = this;
    $.when(this.init_done()).done(function () {
            that._insert_file(file, cb);
        }
    );
};

Synopsis.prototype._insert_file = function (file, cb) {
    var that = this, reader = new FileReader();
    reader.onload = function () {
        var type = "text/turtle";
        if (file.type === "") {
            var extension = file.name.split(".").pop();
            switch (extension) {
                case "ttl":
                case "turtle":
                    type = "text/turtle";
                    break;
                case "nt":
                case "n3":
                    type = "text/n3";
                    break;
                case "json":
                    type = "application/json";
                    break;
                case "jsld":
                    type = "application/ld+json";
                    break;
                default:
                    var str = "Unknown file type extension: " + extension;
                    info.show(str);
                    log(str);
            }
        } else {
            type = file.type;
        }
        var read = this.result;
        that._insert_serialized_str(read, type, cb);
    };
    reader.readAsText(file);
};

Synopsis.prototype.insert_serialized_str = function (data, format, cb) {
    var that = this;
    $.when(this.init_done()).done(function () {
            that.insert_serialized_str(data, format, cb);
        }
    );
};

Synopsis.prototype._insert_serialized_str = function (data, format, cb) {
    this.store_wrap.store.insert_serialized_str(data, format, cb);
};

// !Data insertion

Synopsis.prototype.add_backend = function (url) {
    this.remote.push(url);
};

Synopsis.prototype._show = function (layer, cb) {
    var overlay = this.overlay_manager.make_overlay(layer);
    layer.show_on(overlay.get_content());
    overlay.show();
    var view = {overlay: overlay, layer: layer};
    if (cb)
        cb(view);
    return view;
};

Synopsis.prototype.show = function (layer, cb) {
    if (this._opt.dyn_remote) {
        layer.load_remote();
    }
    return this._show(layer, cb);
};

Synopsis.prototype.get_remote_count = function () {
    return this._opt.remote.length;
};

Synopsis.prototype.clear = function () {
    this.store_wrap.store.clear();
};

// ----- destroy ----- //

/**
 * Clean up after plugin (destroy bindings, clear events..)
 *
 * @method destroy
 */
Synopsis.prototype._destroy = function () {
    this.store_wrap.store.clear();
    delete synopsis_instances[this.id];
};

// make into jQuery plugin
// Lightweight plugin frame.
$.fn[plugin_name] = function (options, cb) {
    return this.each(function () {
        if (!$.data(this, "plugin_" + plugin_name)) {
            $.data(this, "plugin_" + plugin_name, new Synopsis(this, options, cb));
        } else {
            log("Data plugin_" + plugin_name + "already set.");
        }
    });
};

window[plugin_name.charAt(0).toUpperCase() + plugin_name.slice(1)] = Synopsis;
module.exports = Synopsis;

//Copyright 2013 Thomas Weissgerber
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/css":2,"./const/general_plugin":3,"./decorating/manager":10,"./detripling/manager":22,"./history":26,"./info":29,"./layers/factory":32,"./logger":41,"./msg":42,"./overlay_manager":44,"./progress":45,"./remote/remote":47,"./store":48,"./util/misc":54}],50:[function(require,module,exports){
module.exports = function(Handlebars) {

var templates = {};

templates["components.nav"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

  buffer += "<li>\n    <a class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.btn)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers.each.call(depth0, depth0.class_in, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" href=\"#\">\n        ";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n    </a>\n</li>";
  return buffer;
  });

templates["components.scroll"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.scroll_box_content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["history"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.history)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["layer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                                <li><a class=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.prefix || depth0.prefix),stack1 ? stack1.call(depth0, depth0.msg, "sorter-prefix", depth0.id, options) : helperMissing.call(depth0, "prefix", depth0.msg, "sorter-prefix", depth0.id, options)))
    + "</a></li>\n                            ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                            <li><a class=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.prefix || depth0.prefix),stack1 ? stack1.call(depth0, depth0.msg, "filter-prefix", depth0.id, options) : helperMissing.call(depth0, "prefix", depth0.msg, "filter-prefix", depth0.id, options)))
    + "</a></li>\n                        ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers.each.call(depth0, depth0.class_in, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-lg-offset-2 col-md-offset-1 col-xs-offset-0 col-lg-5 col-md-6 col-xs-7 "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.filter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" aria-label=\"...\">\n\n                    <div class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-default "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.filter_btn)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n                                aria-expanded=\"false\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "filter", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "filter", options)))
    + " <span></span></button>\n                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"\n                                aria-expanded=\"false\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "filter_options", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "filter_options", options)))
    + " <span class=\"caret\"></span>\n                        </button>\n                        <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                            ";
  stack2 = helpers.each.call(depth0, depth0.filter, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                        </ul>\n                    </div>\n                    <!-- /btn-group -->\n                </div>\n                <!-- /input-group -->\n            </div>\n            <div class=\"col-lg-3 col-md-4 col-xs-5 "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.sorter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"dropdown\">\n                    <label class=\"control-label\" for=\"sortDropDown\"\n                           style=\"text-align:right\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "sorter", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "sorter", options)))
    + "</label>\n                    <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"sortDropDown\"\n                            data-toggle=\"dropdown\" aria-expanded=\"true\">\n                        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "sorter_default", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "sorter_default", options)))
    + "\n                        <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"col-sm-8 dropdown-menu\" role=\"menu\" aria-labelledby=\"sortDropDown\">\n                        ";
  stack2 = helpers.each.call(depth0, depth0.sorter, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layout_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layout_footer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "empty", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "empty", options)))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["overlay"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                        <li><a id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_filter || depth0.get_filter),stack1 ? stack1.call(depth0, depth0.msg, depth0.id, options) : helperMissing.call(depth0, "get_filter", depth0.msg, depth0.id, options)))
    + "</a></li>\n                    ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"z-index : ";
  if (stack2 = helpers.z_index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.z_index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ";\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " navbar\">\n        <div class=\"container\">\n            <div class=\"navbar-header syn_menu_label navbar-left\">\n                <a class=\"navbar-brand\" disabled=\"\">\n                    <b>";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</b>\n                    <small>";
  if (stack2 = helpers.label_small) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label_small; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\n                </a>\n            </div>\n            <div class=\"collapse navbar-collapse syn_navbar_collapse navbar-right\">\n                <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " nav navbar-nav\">\n                    ";
  stack2 = helpers.each.call(depth0, depth0.nav, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    </div>\n</div>";
  return buffer;
  });

templates["overlay_container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["progress"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_container_wrap)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " col-lg-offset-1 col-md-offset-1 col-xs-offset-1 col-lg-10 col-md-10 col-xs-10\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"> </div>\n</div>";
  return buffer;
  });

templates["progress_bar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-2 col-md-3 col-xs-4\" style=\"display: flex; flex-direction: column; justify-content: center;\">\n    <div>\n        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </div>\n    <div class=\"progress\">\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_bar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " progress-bar progress-bar-success\" style=\"width: 0%\"></div>\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.default"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>";
  return buffer;
  });

templates["tiles.incoming.blank"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Subgraph:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.subject)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is subject of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.incoming.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.subject)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is subject of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.map"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"width:404px; height: 200px\">\n    <iframe width=\"404\" height=\"200\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://maps.google.com/?ie=UTF8&amp;t=m&amp;ll="
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.longitude)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ","
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.latitude)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&amp;spn=0.079502,0.145912&amp;z=12&amp;output=embed\"></iframe>\n</div>";
  return buffer;
  });

templates["tiles.multi.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <b>is object of:</b>\n    ";
  stack2 = helpers.each.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.out), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth1.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth1.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.predicate),stack1 == null || stack1 === false ? stack1 : stack1.nominalValue)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </div>\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <b>is subject of:</b>\n    ";
  stack2 = helpers.each.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.inc), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.resource)),stack1 == null || stack1 === false ? stack1 : stack1.nominalValue)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.out)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.inc)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>";
  return buffer;
  });

templates["tiles.outgoing.blank"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Subgraph:</b>\n    <div class=\"\">\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.outgoing.literal"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.literal)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Value:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.shrink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.y_scroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.object)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.outgoing.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.object)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(helpers.log.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate), {hash:{},data:data}))
    + "\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

return templates;

};
},{}],51:[function(require,module,exports){
(function (global){
var Handlebars = (typeof window !== "undefined" ? window['Handlebars'] : typeof global !== "undefined" ? global['Handlebars'] : null);

// Helper to get message behind str identifier
Handlebars.registerHelper('get_msg', function (msg, str) {
    return msg.get(str);
});

// Helper to prefix given str with type stored under general_plugin module
Handlebars.registerHelper('prefix', function (msg, type, str) {
    return msg.get(require("./const/general_plugin")[type] + str);
});

// Helper prints to console
//Handlebars.registerHelper('log', function (obj) {
//    console.log(obj);
//});

var templates = require("./templates.js")(Handlebars);
module.exports = templates;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./const/general_plugin":3,"./templates.js":50}],52:[function(require,module,exports){
(function (global){
/**
* Extends an object with backbone events and switching. A switch is a event which is triggered once and stays "on". If a function gets bond to a switch in on state it is invoked instantly.
**/

var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null), $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

module.exports = function(obj) {
    obj = $.extend(obj, Backbone.Events);
    if (!obj._saved_switches) {
        obj._saved_switches = {};
    }
    obj.on_switch = function(event, callback, context) {
        if(obj._saved_switches[event]) {
            callback();
        } else {
            obj.once("switch:" + event, callback, context)
        }
    };
    obj.trigger_switch = function(event) {
        obj._saved_switches[event] = true;
        obj.trigger("switch:" + event)
    };
    return obj;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],53:[function(require,module,exports){
(function (global){
var Modernizr = (typeof window !== "undefined" ? window['Modernizr'] : typeof global !== "undefined" ? global['Modernizr'] : null);
var transEndEventName = function() {
    var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition' : 'transitionend',
        'OTransition' : 'oTransitionEnd',
        'msTransition' : 'MSTransitionEnd',
        'transition' : 'transitionend'
    };
    // transition end event name
    return transEndEventNames[Modernizr.prefixed('transition')];
}();
var supportTransitions = Modernizr.csstransitions;

module.exports = {
    /**
     * Get browser dependent event names. (Uses Modernizr)
     *
     * @method getTransEndEventName
     * @return {String} TransitionEnd event name of the current browser
     */
    getTransEndEventName : function() {
        return transEndEventName;
    },

    /**
     * Checks of transitions support is available.
     *
     * @method checkTransitionSupport
     * @return {Boolean}
     */
    getTransitionSupport : function() {
        // transitions support available?
        return supportTransitions;
    }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],54:[function(require,module,exports){
var log = require("../logger.js")("Util");

module.exports = {
    opt_get: function (opt, idSeq) {
        var path = idSeq.split(".");
        var cur = opt;
        for (var i = 0; i < path.length; i++) {
            if (cur.hasOwnProperty(path[i])) {
                cur = cur[path[i]];
            } else {
                log("Option " + idSeq + " not found.");
                return null;
            }
        }
        return cur;
    },
    add_slashes: function (str) {
        return str.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    },
    constr : function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    },
    arrayObjectIndexOf : function(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
    },
    delay : (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })()
};
},{"../logger.js":41}]},{},[49]);
