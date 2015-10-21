var detriplers = {};

var add = function (c) {
    for (var i = 0; i < c.length; i++) {
        var Detripler = c[i];
        var d = new Detripler();
        detriplers[d.id] = d;
    }
};

var constructors = [
    require("./detripler/incoming.blank"),
    require("./detripler/incoming.named"),
    require("./detripler/outgoing.blank"),
    require("./detripler/outgoing.named"),
    require("./detripler/outgoing.literal"),
    require("./detripler/map"),
    require("./detripler/multi.named")
];

add(constructors);

module.exports = detriplers;