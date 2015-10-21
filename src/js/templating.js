var Handlebars = require("handlebars");

// Helper to get message behind str identifier
Handlebars.registerHelper('get_msg', function (msg, str) {
    return msg.get(str);
});

// Helper to prefix given str with type stored under general_plugin module
Handlebars.registerHelper('prefix', function (msg, type, str) {
    return msg.get(require("./const/general_plugin")[type] + str);
});

// Helper prints to console
//Handlebars.registerHelper('log', function (obj) {
//    console.log(obj);
//});

var templates = require("./templates.js")(Handlebars);
module.exports = templates;