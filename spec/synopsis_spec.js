var Synopsis = require("../src/js/synopsis.js"), window=$("<div></div>");

describe("synopsis", function () {
    var synopsis;

    beforeEach(function (done) {
        synopsis = new Synopsis(window);
        $.when(synopsis.init_done()).done(function() {
            done();
        });
    });

    // TODO check
});