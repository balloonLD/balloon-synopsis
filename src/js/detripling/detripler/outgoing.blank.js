var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "outgoing.blank";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.outgoing.blank";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("outgoing.BlankNode", function (blank) {
            if (blank) {
                while (blank.length > 0) {
                    var index = blank.pop();
                    var triple = triples[index];
                    draft.push({direction: "out", triple: triple});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;