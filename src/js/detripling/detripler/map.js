var templating = require("../../templating"), Base_detripler = require("../scheme"), CSS = require("../../const/css");

var ID = "map";

var Detripler = function () {
    Base_detripler.call(this, ID);
    this.worker = true;
    this.template_id = "tiles.map";
    this.fn = function (triples, transport, cb) {
        var draft = [];
        transport.get_concept('outgoing.Literal', function (literal) {
            if (literal) {
                var tmp = {out: {lat: null, long: null}};
                while (literal.length > 0) {
                    var index = literal.pop();
                    var triple = triples[index];
                    if (triple.predicate.nominalValue == 'http://www.w3.org/2003/01/geo/wgs84_pos#long') {
                        tmp.out.long = triple.object.nominalValue;
                    } else if (triple.predicate.nominalValue == 'http://www.w3.org/2003/01/geo/wgs84_pos#lat') {
                        tmp.out.lat = triple.object.nominalValue;
                    }
                }
                if (tmp.out.lat && tmp.out.long) {
                    draft.push({direction: "outgoing", longitude: tmp.out.lat, latitude: tmp.out.long});
                }
            }
            cb(draft);
        });
    };

};

Detripler.prototype = Object.create(Base_detripler.prototype);
Detripler.prototype.constructor = Detripler;

module.exports = Detripler;