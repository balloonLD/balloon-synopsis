/**
 * Singleton local rdf store. Needs to be set once.
 **/

var rdfstore = require("rdfstore"), $ = require("jquery"), log = require("./logger.js")("Store"), RDFModel = window.RDFModel, Util = require("./util/misc.js");

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