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