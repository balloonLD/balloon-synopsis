var log = require("../../logger")("Browsability decorator"), CSS = require("../../const/css");
RDFModel = window.RDFModel;

// ========================= JQuery textfill
// https://gist.github.com/mekwall/1263939 Source code by Marcus Ekwall
// Modifications by Thomas Weißgerber
(function ($) {
    $.fn.textfill = function (maxFontSize, minFontSize, fail) {
        maxFontSize = parseInt(maxFontSize, 10);
        minFontSize = parseInt(minFontSize, 10);
        return this
            .each(function (i, val) {
                var ourText = $(val), parent = ourText.parent(), maxHeight = parent.height(), maxWidth = parent
                    .width(), fontSize = parseInt(ourText.css("fontSize"), 10), tmpMultW = maxWidth
                    / ourText.width(), tmpMultH = maxHeight / ourText.height(), multiplier = (tmpMultW < tmpMultH) ? tmpMultW
                    : tmpMultH, newSize = (fontSize * (multiplier - 0.1));
                if (maxFontSize > 0 && newSize > maxFontSize) {
                    newSize = maxFontSize;
                }
                if (minFontSize > 0 && newSize < minFontSize) {
                    fail(parent);
                    newSize = minFontSize;
                    ourText.css("fontSize", newSize);
                } else {
                    ourText.css("fontSize", newSize);
                    while (parent.get(0).scrollWidth > parent.width()) {
                        minFontSize--;
                        if (minFontSize > 0 && newSize < minFontSize) {
                            fail(parent);
                            newSize = minFontSize;
                            ourText.css("fontSize", newSize);
                            break;
                        } else {
                            ourText.css("fontSize", newSize);
                        }
                    }
                }
            });
    };
})(jQuery);

var Decorator = function () {
    this.id = "text_size";
    this.decorate = function (divs, synopsis, config, cb) {
        for (var i = 0; i < divs.length; i++) {
            var div = $(divs[i]);
            var dyn_text_div = div.find("." + CSS.dynamic_text_size);
            dyn_text_div.textfill(80, 12, function ($parent) {
                $parent.css({
                    "overflow-y": "auto",
                    "word-wrap": "break-word"
                })
            });
        }
        if (cb)
            cb(divs);
        return divs;
    }
};

module.exports = Decorator;