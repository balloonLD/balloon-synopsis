var e_ext = require("../util/event_obj_extender");

var max_url_length = 2000;

var Debounced_remote_loader = function (synopsis, query, url, fail) {
    this.synopsis = synopsis;
    this.query = query;
    this.values = [];
    this.value_map = {};
    this.cbs = {};
    this.fail = fail;
    this.url = url;
    this.query_length = encodeURIComponent(query).length;
    var that = e_ext(this);
    that.on("DoQuery", function () {
        that.run_on_remote();
    }.debounce(100));
    return that;
};

Debounced_remote_loader.dummy = "Filter_()";

Debounced_remote_loader.prototype.add_value = function (val, cb) {
    if (this.synopsis._opt.dyn_remote) {
        var encoded_uri_part_length = encodeURIComponent("<" + val + "> || ");
        // Ignore debounce if max length is reached
        if (this.query_length + encoded_uri_part_length.length > max_url_length) {
            this.run_on_remote();
        }

        // Add new to debounced query
        if (!this.value_map[val]) {
            this.value_map[val] = true;
            this.values.push(val);
            this.query_length += encoded_uri_part_length.length;
            if (!this.cbs[val])
                this.cbs[val] = [];
            this.cbs[val].push(cb);
            this.trigger("DoQuery");
        }
    } else {
        cb([]);
    }
};

Debounced_remote_loader.prototype.run_on_remote = function () {
    var that = this;
    if (that.values.length > 0) {
        var query_values = that.values.slice();
        this.synopsis.execute_on_remote(this.pop_query(), this.url, function (res) {
            var bindings = {};
            for (var i = 0; i < res.results.bindings.length; i++) {
                var val = res.results.bindings[i].value.value;
                if (!bindings[val])
                    bindings[val] = [];
                bindings[val].push(res.results.bindings[i]);
            }
            for (var j = 0; j < query_values.length; j++) {
                if (!bindings[query_values[j]]) {
                    for (var k = 0; k < that.cbs[query_values[j]].length; k++) {
                        that.cbs[query_values[j]][k]([]);
                    }
                } else {
                    for (var k = 0; k < that.cbs[query_values[j]].length; k++) {
                        that.cbs[query_values[j]][k](bindings[query_values[j]]);
                    }
                }
            }
        }, this.fail);
    }
};

Debounced_remote_loader.prototype.pop_query = function () {
    var values = this.values;
    this.query_length = encodeURIComponent(this.query).length;
    this.values = [];
    var replacement = "Filter (";
    for (var i = 0; i < values.length; i++) {
        delete this.value_map[values[i]];
        replacement += "?value=" + "<" + values[i] + ">";
        if (i < values.length - 1)
            replacement += " || "
    }
    replacement += ")";
    return this.query.replace(Debounced_remote_loader.dummy, replacement);
};

module.exports = Debounced_remote_loader;