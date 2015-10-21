var log = require("../../logger")("Browsability decorator"), chroma = require("chroma-js"), md5 = require("js-md5"), CSS = require("../../const/css");
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
                                if (res.length == 0) {
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