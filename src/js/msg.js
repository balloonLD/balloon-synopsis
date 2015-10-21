var log = require("./logger")("Language");

var Languages = function (language) {
    this.languages = {
        en: require("./languages/en.json"),
        de: require("./languages/de.json")
    };
    this.set_language(language);
};

Languages.prototype.get = function (id) {
    if (this.languages[this._cur][id]) {
        return this.languages[this._cur][id];
    } else {
        log("Couldn't find " + id + " in language object.");
        return id;
    }
};

Languages.prototype.set = function (lang, id, val) {
    this.languages[lang][id] = val;
};

Languages.prototype.set_language = function (language) {
    this._cur = this.languages[language] ? language : "en";
};

Languages.prototype.get_language = function () {
    return this._cur;
};

module.exports = Languages;