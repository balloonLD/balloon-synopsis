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