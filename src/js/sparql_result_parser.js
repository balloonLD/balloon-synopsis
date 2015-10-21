var Util = require("./util/misc.js");
require("rdfstore");

var Parser = {};

Parser.parse_to_graph = function(bindings, structure) {
    if (!structure) {
        structure = ["s", "p", "o"];
    }
    var store = this._local_store, graph = RDFModel.rdf.createGraph();
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
            triple_data[j] = RDFModel.buildRDFResource(atom, null, store.engine, {blanks: {}, outCache: {}});
        }
        graph.add(store.rdf.createTriple.apply(null, triple_data));
    }
    return graph;
};

module.exports = Parser;