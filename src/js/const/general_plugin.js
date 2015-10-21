var package_json = require("../../../package.json");

var misc = {
    "name": package_json.name,
    "sorter-prefix": "sorter-",
    "filter-prefix": "filter-"
};

if (!misc.hasOwnProperty("prefix")) {
    misc.prefix = misc.name.length >= 3 ? misc.name.substr(0, 3) + "_" : "";
}

module.exports = misc;