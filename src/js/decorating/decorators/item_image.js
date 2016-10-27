var log = require("../../logger")("Browsability decorator"), info = require('../../info'), Layer_factory = require("../../layers/factory");
var Debounced_remote = require("../../remote/debounced_remote");
RDFModel = window.RDFModel;

var Decorator = function () {
    this.id = "item_image";
    this.config = {
        dref : "http://mico-platform:8080/broker/status/download?itemUri=",
        types : {
            "item": function (draft) {
                return draft.leads_to.nominalValue;
            }
        }
    };
    this.decorate = function (divs, synopsis, config, cb) {
        var debounced_remote_loader = new Debounced_remote(synopsis, "SELECT DISTINCT ?value ?asset ?type ?format WHERE { ?value <http://www.mico-project.eu/ns/mmm/2.0/schema#hasAsset> ?asset . ?asset <http://purl.org/dc/elements/1.1/format> ?format. ?asset <http://purl.org/dc/elements/1.1/format> ?format. " + Debounced_remote.dummy + " }", null);
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var type = div.data("type");
            if (config["types"].hasOwnProperty(type)) {
                div.on("appended", function (d, part_uri) {
                    debounced_remote_loader.add_value(part_uri, function (bindings) {
                        if (bindings.length > 0 && (bindings[0]["format"].value == "image/png" || bindings[0]["format"].value == "image/jpeg" || bindings[0]["format"].value == "image/jpg")) {
                            if (!d.data("image")) {
                                d.data("image", bindings[0]["asset"].value);
                                var width = d.width() - 20;
                                d.prepend("<div class='" + CSS.shrink + "'><img class="+ CSS.thumbnail +" src='"+config["dref"]+bindings[0]["value"].value+"' width='"+ width +"'></div>");
                            }
                        }
                    });
                }(div, config["types"][type](div.data("draft_data"))));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;