/**
 * Singleton Progress box creation.
 **/

var $ = require("jquery"), CSS = require("./const/css.js"), templating = require('./templating'), e_ext = require("./util/event_obj_extender");

var DONE_DELETE = 1200, DONE_FADE = 1000;

var Progress_Bar = function (label, progress_num) {
    this._$html = $(templating["progress_bar"]({CSS: CSS, label: label}));
    this._progress = Array.apply(null, new Array(progress_num)).map(Number.prototype.valueOf, 0);
    this._partial = Array.apply(null, new Array(progress_num)).map(Number.prototype.valueOf, 1);
    this._$progress_bar = this._$html.find("." + CSS.progress_bar);
    return e_ext(this);
};

Progress_Bar.prototype.get_progress = function () {
    var progress_n = 0;
    for (var i = 0; i < this._progress.length; i++) {
        progress_n += this._progress[i];
    }
    return progress_n;
};

Progress_Bar.prototype.get_max_progress = function () {
    return this._progress.length;
};

Progress_Bar.prototype.do_progress = function (index) {
    this._progress[index] = 1;
    var q = this.get_progress() / this.get_max_progress();
    this._$progress_bar.width(q * 100 + "%");
    if (q == 1) {
        this.done();
    }
};

Progress_Bar.prototype.do_partial_progress = function (index) {
    this._progress[index] = 1 - (1 / (this._partial[index] += 0.25));
    var q = this.get_progress() / this.get_max_progress();
    this._$progress_bar.width(q * 100 + "%");
};

Progress_Bar.prototype.do_warn = function () {
    this._$progress_bar.addClass("progress-bar-warning");
};

Progress_Bar.prototype.do_stop = function () {
    this._$progress_bar.addClass("progress-bar-warning");
    this._$progress_bar.addClass("progress-bar-striped");
    this._$progress_bar.width("100%");
    this.done();
};

Progress_Bar.prototype.remove = function () {
    this._$html.remove();
};

Progress_Bar.prototype.done = function () {
    this.trigger("done");
};

var Progress = function () {
    this.unappended = true;
    this.bar_num = 0;
    this._$html = $(templating["progress"]({CSS: CSS}));
    // Remote & progress
    this._$progress_container = this._$html.find("." + CSS.progress_container);

    var that = this;
    this._$html.click(function () {
        setTimeout(function () {
            that.hide();
        }, 100);
    });
};

Progress.prototype.append_to = function (ele) {
    $(ele).append(this._$html);
    this.unappended = false;
};

Progress.prototype.make_n_add_bar = function (label, n) {
    var bar = new Progress_Bar(label, n), that = this;
    bar.on("done", function (bar) {
        return function () {
            that.bar_num--;
            if (that.bar_num == 0) {
                setTimeout(function () {
                    that.hide();
                }, DONE_FADE)
            }
            setTimeout(function () {
                bar.remove();
            }, DONE_DELETE)
        }
    }(bar));
    this.bar_num++;
    this._$progress_container.append(bar._$html);
    return bar;
};

Progress.prototype.show = function () {
    this._$html.addClass(CSS.fadeIn);
};

Progress.prototype.hide = function () {
    this._$html.removeClass(CSS.fadeIn);
};

var instance = new Progress();

module.exports = instance;