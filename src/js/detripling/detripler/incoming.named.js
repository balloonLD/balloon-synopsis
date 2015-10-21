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