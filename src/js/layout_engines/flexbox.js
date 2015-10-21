var CSS = require("../const/css");

var defaults = {
    batch_size: 1
};

var Flex_layout = function (box, footer, msg, opt) {
    this._opt = !opt ? defaults : $.extend({}, defaults, opt);
    this._$footer = footer;
    this._ele = box.get_content_container();
    this.box = box;
    this._msg = msg;
    this.divs = [];
    this.paint_index = 0;
    var that = this;
    this.box.on("get_more", function () {
        if (that.paint_index < that.divs.length) {
            that.paint_next();
        } else {
            if (that.paint_index == 0) {
                that.set_footer(0);
            }
            that.box.disable_observer();
        }
    });
    this._backup_divs = [];
};

Flex_layout.prototype.add = function (divs) {
    this.divs = this.divs.concat(divs);
    if (!this.box.has_scroll_bar()) {
        this.box.fill_until_scrollbar();
    }
    this._backup_divs = this.divs;
};

Flex_layout.prototype.paint_next = function () {
    if (this.paint_index < this.divs.length) {
        var end_index = Math.min(this.paint_index + this._opt.batch_size, this.divs.length);
        var divs = [];
        while (this.paint_index < end_index) {
            divs.push(this.divs[this.paint_index]);
            this.paint_index++;
        }
        if (!this._ele.hasClass(CSS.fadeIn))
            this._ele.addClass(CSS.fadeIn);
        this.box.append(divs, function (d) {
            for (var i = 0; i < d.length; i++) {
                d[i].trigger("appended");
            }
        });

        //show more tile number
        var unpainted_number = this.divs.length - this.paint_index;
        this.set_footer(this.paint_index, unpainted_number);
    } else {
        this.box.disable_observer();
    }
};

Flex_layout.prototype.set_footer = function (painted_number, unpainted_number) {
    if (unpainted_number) {
        this._$footer.html((painted_number) + " " + this._msg.get("n_tiles") + " " + this._msg.get("and") + " " + unpainted_number + " " + this._msg.get("more"));
    } else {
        this._$footer.html((painted_number) + " " + this._msg.get("n_tiles"));
    }
};

Flex_layout.prototype.clear = function (callback) {
    this.paint_index = 0;
    this.box.clear(callback);
};


Flex_layout.prototype.sort = function (sorter) {
    this.divs.sort(sorter);
    var that = this;
    this.clear(function() {
        setTimeout(function() {that.box.fill_until_scrollbar();}, 0)
    });
};

Flex_layout.prototype.filter = function (filter_functions) {
    var divs = this._backup_divs;
    for (var i = 0, len = filter_functions.length; i < len; i++) {
        var tmp = [];
        for (var j = 0, jlen = divs.length; j < jlen; j++) {
            var tile = $(divs[j]);
            if (filter_functions[i](tile)) {
                tmp.push(tile);
            }
        }
        divs = tmp;
    }
    this.divs = divs;
    var that = this;
    this.clear(function() {
        setTimeout(function() {that.box.fill_until_scrollbar();}, 0)
    });
};

module.exports = Flex_layout;