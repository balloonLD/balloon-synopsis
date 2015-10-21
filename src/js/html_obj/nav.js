var CSS = require("./../const/css.js"), templating = require('./../templating.js');

var Nav = function (fn, l, ele, c) {
    this._$html = $(templating["components.nav"]({CSS: CSS, class_in: c, label: l}));
    this._fn = fn;
    this._$html.on("click", this._fn);
    if (ele)
        ele.append(this._$html);
};

Nav.prototype.toggle_disable = function () {
    this._$html.toggleClass(CSS.disabled);
    if (this._$html.hasClass(CSS.disabled)) {
        this._$html.off("click", this._fn);
    } else {
        this._$html.on("click", this._fn)
    }
};

module.exports = Nav;