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