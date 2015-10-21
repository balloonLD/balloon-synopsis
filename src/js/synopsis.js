var $ = require("jquery");
require("rdfstore");
var plugin_name = require("./const/general_plugin").name;
var GUID = 0, synopsis_instances = [], log = require("./logger")();
var Util = require("./util/misc"), Remote = require("./remote/remote"), info = require('./info'), progress = require('./progress');
var Overlay_m = require("./overlay_manager"), RDFModel = window.RDFModel, Layer_factory = require("./layers/factory");
var Msg = require("./msg"), History = require("./history");
var Detripler_manager = require("./detripling/manager"), Decorator_manager = require("./decorating/manager");

//var defaults = require("./defaults.json");
var defaults = {
    "lang": "en",
    "dyn_remote": true,
    "remote_batch_size": 9999,
    "store": {},
    "detripling": {},
    "decorating": {},
    "remote": [
        [
            "http://dbpedia.org/sparql",
            "?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=",
            "&format=application%2Fsparql-results%2Bjson&timeout=300000"
        ]
    ]
};

/**
 * Extend jQUery selector for contains
 */
$.expr[":"].containsInsensitive = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/**
 * Main plugin class
 *
 * @param ele Parent element
 * @param opt Options object
 * @constructor
 * @param cb Callback on init
 */
var Synopsis = function (ele, opt, cb) {
    // use element as selector string
    if (typeof ele === 'string') {
        ele = document.querySelector(ele);
    }
    if (!ele) {
        ele = $("<div></div>");
    }
    this._$ele = $(ele);
    if (info.unappended)
        info.append_to(ele);
    this.info = info;
    this.css = require("./const/css");

    if (progress.unappended)
        progress.append_to(ele);
    this.progress = progress;

    this.init_dfd = $.Deferred();

    this.rdf = RDFModel.rdf;

    // options
    if (opt) {
        this._opt = $.extend(true, {}, defaults, opt);
    } else {
        this._opt = $.extend(true, {}, defaults);
    }

    this.msg = new Msg(this._opt.lang);

    this.detriple_manager = new Detripler_manager(this._opt.detripling);
    this.decorator_manager = new Decorator_manager(this._opt.decorating, this);
    this.id = GUID++;

    this.remote = [];
    if (this._opt.remote) {
        for (var i = 0; i < this._opt.remote.length; i++) {
            this.remote.push(new Remote(this._opt.remote[i]));
        }
    }

    var store_opt = Util.opt_get(this._opt, "store"), Store = require("./store");
    if (store_opt)
        Store.set(store_opt);
    this.store_wrap = Store.get();
    var that = this;
    $.when(this.store_wrap.store.init_done()).done(function () {
            that.init_dfd.resolve();
            if (cb)
                cb(that);
        }
    );

    this._history = new History(this);

    var overlay_m_opt = Util.opt_get(that._opt, "overlay_manager");
    that.overlay_manager = new Overlay_m(this._history, this.msg, that._$ele, overlay_m_opt);

    synopsis_instances[this.id] = this; // associate via id
};

Synopsis.Layer_factory = Layer_factory;

Synopsis.prototype.init_done = function () {
    return this.init_dfd.promise();
};

// Data insertion

Synopsis.prototype.fetch = function (uri, cb, fail) {
    var that = this;
    for (var i = 0; i < this.remote.length; i++) {
        this.remote[i].execute("DESCRIBE " + uri, function (resp) {
            that.store_wrap.store.insert_triples(resp.results.bindings);
            cb(resp);
        }, fail);
    }
};

Synopsis.prototype.execute_on_remote = function (query, url, cb, fail) {
    var use_predef_remotes = false, did_remote = false;
    if (!url || url == "" || url == null) {
        use_predef_remotes = true;
    }

    for (var i = 0; i < this.remote.length; i++) {
        if (use_predef_remotes || url == this.remote[i].get_service_name()) {
            did_remote = true;
            this.remote[i].execute(query,
                function (remote_num) {
                    return function (resp) {
                        if (cb)
                            cb(resp, remote_num);
                    }
                }(i),
                function (remote_num) {
                    return function (e) {
                        if (fail)
                            fail(e, remote_num);
                    }
                }(i));
        }
    }
    if (!did_remote)
        info.show("Remote service isn't added to remote backends. Execute on remote failed.");
};

Synopsis.prototype.execute_on_remote_with_limits = function (query, p_query_num, flag, cb, fail) {
    var tmp_query = query + " LIMIT " + this._opt.remote_batch_size + " OFFSET " + p_query_num * this._opt.remote_batch_size, that = this;
    this.execute_on_remote(tmp_query, null,
        function (q, fl, c, f) {
            return function (resp, remote_num) {
                if (resp.results.bindings.length > 0 && (!fl || !fl.interrupt)) {
                    if (resp.results.bindings.length == that._opt.remote_batch_size) {
                        setTimeout(function () {
                            that.execute_on_remote_with_limits(q, p_query_num + 1, fl, c, f)
                        }, 100);

                        // callback with response, number of remote service and partial true flag
                        c(resp, remote_num, true);
                    } else {

                        // callback with response, number of remote service and partial false flag
                        c(resp, remote_num, false);
                    }
                }
            }
        }(query, flag, cb, fail), fail, flag);
};

Synopsis.prototype.insert_file = function (file, cb) {
    var that = this;
    $.when(this.init_done()).done(function () {
            that._insert_file(file, cb);
        }
    );
};

Synopsis.prototype._insert_file = function (file, cb) {
    var that = this, reader = new FileReader();
    reader.onload = function () {
        var type = "text/turtle";
        if (file.type === "") {
            var extension = file.name.split(".").pop();
            switch (extension) {
                case "ttl":
                case "turtle":
                    type = "text/turtle";
                    break;
                case "nt":
                case "n3":
                    type = "text/n3";
                    break;
                case "json":
                    type = "application/json";
                    break;
                case "jsld":
                    type = "application/ld+json";
                    break;
                default:
                    var str = "Unknown file type extension: " + extension;
                    info.show(str);
                    log(str);
            }
        } else {
            type = file.type;
        }
        var read = this.result;
        that._insert_serialized_str(read, type, cb);
    };
    reader.readAsText(file);
};

Synopsis.prototype.insert_serialized_str = function (data, format, cb) {
    var that = this;
    $.when(this.init_done()).done(function () {
            that.insert_serialized_str(data, format, cb);
        }
    );
};

Synopsis.prototype._insert_serialized_str = function (data, format, cb) {
    this.store_wrap.store.insert_serialized_str(data, format, cb);
};

// !Data insertion

Synopsis.prototype.add_backend = function (url) {
    this.remote.push(url);
};

Synopsis.prototype._show = function (layer, cb) {
    var overlay = this.overlay_manager.make_overlay(layer);
    layer.show_on(overlay.get_content());
    overlay.show();
    var view = {overlay: overlay, layer: layer};
    if (cb)
        cb(view);
    return view;
};

Synopsis.prototype.show = function (layer, cb) {
    if (this._opt.dyn_remote) {
        layer.load_remote();
    }
    return this._show(layer, cb);
};

Synopsis.prototype.get_remote_count = function () {
    return this._opt.remote.length;
};

Synopsis.prototype.clear = function () {
    this.store_wrap.store.clear();
};

// ----- destroy ----- //

/**
 * Clean up after plugin (destroy bindings, clear events..)
 *
 * @method destroy
 */
Synopsis.prototype._destroy = function () {
    this.store_wrap.store.clear();
    delete synopsis_instances[this.id];
};

// make into jQuery plugin
// Lightweight plugin frame.
$.fn[plugin_name] = function (options, cb) {
    return this.each(function () {
        if (!$.data(this, "plugin_" + plugin_name)) {
            $.data(this, "plugin_" + plugin_name, new Synopsis(this, options, cb));
        } else {
            log("Data plugin_" + plugin_name + "already set.");
        }
    });
};

window[plugin_name.charAt(0).toUpperCase() + plugin_name.slice(1)] = Synopsis;
module.exports = Synopsis;

//Copyright 2013 Thomas Weissgerber
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.