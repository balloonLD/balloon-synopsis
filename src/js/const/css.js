var name = require("./general_plugin.js").name;
var css = {
    "monolog": "monolog",
    "fadeIn": "fadeIn",
    "flex": "flex",
    "show": "show",
    "tile": "tile",
    "flex_parent": "flex_parent",
    "menu": "menu",
    "overlay_menu": "overlay_menu",
    "overlay": "overlay",
    "history": "history",
    "menu_label": "menu_label",
    "overlay_container": "overlay_container",
    "overlay_content": "overlay_content",
    "filter": "filter",
    "filter_btn": "filter_btn",
    "sorter": "sorter",
    "named_node": "named_node",
    "layer": "layer",
    "layout_container": "layout_container",
    "dropdown": "dropdown",
    "dropdown_item": "dropdown_item",
    "btn": "btn",
    "btn_toolbar": "btn_toolbar",
    "btn_grp": "btn_grp",
    "navbar_collapse": "navbar_collapse",
    "navbar_nav": "navbar_nav",
    "navbar_nav_item": "navbar_nav_item",
    "progress_container": "progress_container",
    "progress_bar": "progress_bar",
    "progress_container_wrap": "progress_container_wrap",
    "no_scroll": "no_scroll",
    "scroll_box": "scroll_box",
    "scroll_box_content": "scroll_box_content",
    "layout_footer": "layout_footer",
    "semantic_color": "semantic_color",
    "uri": "uri",
    "label": "label",
    "uri_to_label": "uri_to_label",
    "dynamic_text_size": "dynamic_text_size",
    "shrink": "shrink",
    "y_scroll": "y_scroll",
    "thumbnail": "thumbnail",
    "hidden": "hidden",
    "disabled": "disabled",
    "literal": "literal"
};
var prefix = require("./general_plugin.js").prefix ? require("./general_plugin.js").prefix : name.length >= 3 ? name.substr(0, 3) + "_" : name + "_";

var keys = Object.keys(css);
for (var i = 0; i < keys.length; i++) {
    css[keys[i]] = prefix + css[keys[i]];
}


module.exports = css;