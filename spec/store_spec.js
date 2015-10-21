var Store = require("../src/js/store.js");

describe("store", function () {
    var store, err, result;

    beforeEach(function (done) {
        var bindings = [{
            sub: {token: "uri", value: "Alice"},
            pre: {token: "uri", value: "hasAge"},
            obj: {token: "literal", value: 29}
        }];
        var t_struct = ["sub", "pre", "obj"];
        store = Store.get();
        $.when(store.store.init_done()).done(function () {
            store.store.insert_triples(bindings, t_struct, function (e, r) {
                err = e;
                result = r;
                done();
            });
        });
    });

    it("should have inserted successfully", function () {
        expect(err).toBeNull();
        expect(result).toBe(true);
    });
});