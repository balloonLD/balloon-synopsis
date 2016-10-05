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