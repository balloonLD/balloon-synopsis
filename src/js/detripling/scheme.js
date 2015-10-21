var templating = require("../templating"), CSS = require("../const/css"), Handlebars = require("handlebars");

var Detripler = function (id) {
    this.derived_from_base = true;
    this.id = id;
    this.parents = [];
    this.fn = function (triples, transport, cb) {
        console.log("Base function called for " + triples);
        cb(triples);
    };
    // Use template by id
    // OR ..
    this.template_id = "tiles.default";
    // .. use this templating function
    this.templating_fn = function (draft, triples) {
        var divs = [], template;
        if (this.template) {
            if (this.compiled_template) {
                template = this.compiled_template;
            } else {
                this.compiled_template = Handlebars.compile(this.template);
                template = Handlebars.compile(this.template);
            }
        } else {
            if (this.template_id) {
                template = templating[this.template_id];
            } else {
                template = templating["tiles.default"];
            }
        }
        if (draft) {
            for (var i = 0; i < draft.length; i++) {
                var div = $(template({CSS: CSS, data: {draft: draft[i], detripler: this}}));
                div.data("draft_data", draft[i]);
                div.data("post_view_cbs", []);
                div.data("type", this.id);
                divs.push(div);
            }
        }
        return divs;
    };
    this.worker = true;
};

module.exports = Detripler;