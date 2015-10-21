var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var CSS = require("./../const/css.js"), templating = require('./../templating.js'), e_ext = require("../util/event_obj_extender");

var Scroll = function (ele) {
    this._$html = ele;
    this._$html.addClass(CSS.scroll_box);
    this._$content = $(templating["components.scroll"]({CSS: CSS}));
    if (ele)
        ele.append(this._$content);
    var that = this;

    // Load if bottom of scroll is reached
    this._$html.scroll(function () {
        if ((that._$html.scrollTop() + that._$html.height() >= that._$content.outerHeight() - 5)) {
            that.add_row();
        }
    }.debounce(10));
    return e_ext(this);
};

Scroll.prototype.get_content_container = function () {
    return this._$content;
};

Scroll.prototype.add_row = function (cb) {
    var that = this;
    // Load after modification if we got more space
    this._observer = new MutationObserver(function (c) {
        return function (m, observer) {
            if (observer._start_height >= that._$content.height()) {
                // Timeout to make sure height was updated before adding next
                setTimeout(function(){that.trigger("get_more");}, 0);
            } else {
                if (observer._start_height == 0) {
                    observer._start_height = that._$content.height();
                    that.trigger("get_more");
                } else {
                    observer.disconnect();
                    if (c)
                        c();
                }
            }
        }
    }(cb));
    this._observer._start_height = this._$content.height();
    this._observer.observe(this._$content[0], {
        childList: true,
        subtree: false,
        attributes: false
    });
    that.trigger("get_more");
};

Scroll.prototype.fill_until_scrollbar = function () {
    var that = this;
    if (!this.has_scroll_bar()) {
        this.add_row(function () {
            that.fill_until_scrollbar();
        });
    }
};

Scroll.prototype.append = function (ele, cb) {
    this._$content.append(ele);
    if(cb)
        cb(ele)
};

Scroll.prototype.has_scroll_bar = function () {
    return this._$content.height() > this._$html.height() + 5;
};

Scroll.prototype.clear = function (callback) {
    this._$content.children().detach();
    if (callback)
        callback();
};

// Function to call if there is no more to add
Scroll.prototype.disable_observer = function () {
    this._observer.disconnect();
};

module.exports = Scroll;