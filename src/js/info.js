/**
 * Singleton info box creation.
 **/

var $ = require("jquery"), CSS = require("./const/css.js"), U_layout = require("./util/layout.js");

var START_FADEOUT = 3000;

var Info = function () {
    this.timeout = null;
    this.unappended = true;
    this.$info = $("<div class=" + CSS.monolog + "></div>");
    var that = this;
    this._start_timer = function () {
        clearTimeout(that.timeout);
        that.timeout = setTimeout(function () {
            that.hide();
        }, START_FADEOUT);
    };
    this.$info.click(function () {
        clearTimeout(that.timeout);
        that.$info.removeClass(CSS.fadeIn);
    });
};

Info.prototype.append_to = function (ele) {
    $(ele).append(this.$info);
    this.unappended = false;
};

Info.prototype._add_message = function (msg) {
    var span = $("<span style='height: 40px'>" + msg + "</span>"), children = this.$info.children();
    if (U_layout.getTransitionSupport()) {
        switch (children.size()) {
            case 0:
                span.css("bottom", "-80px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
            case 1:
                span.css("bottom", "-40px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
            default:
                while (this.$info.children().size() >= 2) {
                    children.first().remove();
                }
                span.css("bottom", "-40px");
                this.$info.append(span);
                setTimeout(function () {
                    span.css("bottom", "0px");
                }, 0);
                break;
        }
    } else {
        switch (children.size()) {
            case 0:
            case 1:
                this.$info.append(span);
                break;
            default:
                while (this.$info.children().size() >= 2) {
                    children.first().remove();
                }
                this.$info.append(span);
                break;
        }
    }
};


Info.prototype.show = function (msg) {
    clearTimeout(this.timeout);
    var that = this;
    if (msg) {
        setTimeout(function () {
            that._add_message(msg);
            that._start_timer(that);
        }, 500);
    }
    setTimeout(function () {
        that.$info.addClass(CSS.fadeIn);
    }, 50);
};

Info.prototype.hide = function () {
    this.$info.removeClass(CSS.fadeIn);
};

var instance = new Info();

module.exports = instance;