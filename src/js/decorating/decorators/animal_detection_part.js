var log = require("../../logger")("Browsability decorator"), info = require('../../info'), Layer_factory = require("../../layers/factory");
var Debounced_remote = require("../../remote/debounced_remote");
RDFModel = window.RDFModel;

var Decorator = function () {
    this.id = "animal_detection_part";
    this.config = {
        "outgoing.named": function (draft) {
            return draft.triple.object;
        }
    };
    this.decorate = function (divs, synopsis, config, cb) {
        var debounced_remote_loader = new Debounced_remote(synopsis, "SELECT DISTINCT ?value ?animal ?coord ?lo WHERE { ?value <http://www.w3.org/ns/oa#hasBody> ?body. ?body rdf:type <http://www.mico-project.eu/ns/mmmterms/2.0/schema#AnimalDetectionBody>." +
            "?body rdf:value ?animal. ?value <http://www.mico-project.eu/ns/mmm/2.0/schema#hasTarget> ?target. ?target <http://www.mico-project.eu/ns/mmm/2.0/schema#hasSelector> ?selector. ?selector rdf:value ?coord. " + Debounced_remote.dummy + " }", null);
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var type = div.data("type");
            if (config.hasOwnProperty(type)) {
                div.on("appended", function (d, part_uri) {
                    debounced_remote_loader.add_value(part_uri, function (bindings) {
                        if (bindings.length > 0) {
                            d.append("<b>Found animal:</b> <div>"+bindings[0].animal.value+"</div>");
                            d.append("<b>On coordiantes</b> <div>"+bindings[0].coord.value+"</div>");
                        }
                    });
                }(div, config[type](div.data("draft_data"))));
            }
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;