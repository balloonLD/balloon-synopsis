var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "incoming.blank";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.incoming.blank";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept("incoming.BlankNode", function (blank) {
            if (blank) {
                while (blank.length > 0) {
                    var index = blank.pop();
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