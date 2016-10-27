var detriplers = {};

var add = function (c) {
    for (var i = 0; i < c.length; i++) {
        var Detripler = c[i];
        var d = new Detripler();
        detriplers[d.id] = d;
    }
};

var constructors = [
    require("./detripler/outgoing.blank"),
    require("./detripler/outgoing.named"),
    require("./detripler/outgoing.literal")
];

add(constructors);

module.exports = detriplers;