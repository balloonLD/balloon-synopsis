var decorators = {keys_for_decorators: []};

var add = function (Decorator) {
    var decorator = new Decorator();
    decorators[decorator.id] = decorator;
    decorators.keys_for_decorators.push(decorator.id);
};

add(require("./decorators/animal_detection_part"));
add(require("./decorators/item_image"));
add(require("./decorators/browsability"));
add(require("./decorators/semantic_color"));
add(require("./decorators/uri_to_label"));
add(require("./decorators/uri_to_thumbnail"));
add(require("./decorators/text_size"));

module.exports = decorators;