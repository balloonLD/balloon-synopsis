balloon-synopsis - Visualizing RDF Data
================

For more information and a demo click [here](http://schlegel.github.io/balloon/balloon-synopsis.html)

**RDF data is online - most RDF visualizer are not**

We see the necessity for an easy-to-use RDF visualizer which everybody can embed in a homepage. Therefore we are developing balloon Synopsis. A node-centric RDF viewer & browser in a modern tile design, available as jQuery-plugin.

balloon Synopsis is part of the balloon project (http://schlegel.github.io/balloon). balloon aims at offering public services and tools to take advantage of the semantic web with less effort. 

Our current prototype offers following features:

* HTML/JavaScript RDF Viewer & Browser
* jQuery Plugin
* Automatic information enhancement (intergration of [balloon Fusion](http://schlegel.github.io/balloon/balloon-fusion.html))
* Configurable Templating (aggregate information for human-friendly view e.g. Google Maps instead of long/lat)
* Timeline (track history of the browsing behaviour)

![Screenshot](http://schlegel.github.io/balloon/images/slider/balloon_synopsis.png)

# Installation
The plugin javascript file is located in the build/ folder of the distribution. To use balloon Synopsis just include this file in your page. If you need to make individual changes to balloon Synopsis you can modify the *js/raw/bSynopsis.js* file and rebuild the project via [Grunt](http://gruntjs.com/api/grunt) as explained in following sections.

## Building

Changing underlying templates (to be found in *templates/raw/*) and functionalities of balloon Synopsis requires a rebuild of the project. You can use [Grunt](http://gruntjs.com/api/grunt) to generate the *template.js* after adding or altering the template files. Grunt is used to load dependencies, preprocess source files, precompile handlebar templates and concatinate all required files to a compressed build file.

### Grunt build

Grunt and Grunt plugins are installed and managed via npm, the [Node.js](http://nodejs.org/) package manager.
You will need to install following Grunt plugins.

* [grunt-contrib-concat](https://npmjs.org/package/grunt-contrib-concat)
* [grunt-contrib-handlebars](https://npmjs.org/package/grunt-contrib-handlebars)
* [grunt-contrib-uglify](https://npmjs.org/package/grunt-contrib-uglify)
* [grunt-contrib-yuidoc](https://npmjs.org/package/grunt-contrib-yuidoc)
* [grunt-bower-task](https://www.npmjs.org/package/grunt-bower-task)
* [grunt-bower-install](https://www.npmjs.org/package/grunt-bower-install)
* [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy)
* [grunt-preprocess](https://www.npmjs.org/package/grunt-preprocess)

To load these plugins you can simply use "npm install" in the projects directory.

### Dependency loading

Following dependencies are loaded by grunt. They are defined in the *bower.json* of balloon Synopsis.

 * [jQuery](http://jquery.com/) 1.8.3
 * [jQuery.isotope](http://isotope.metafizzy.co/)
 * [handlebars](http://handlebarsjs.com/)
 * [modernizr](http://modernizr.com/)
 * [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js)
 * [rgbcolor](http://www.phpied.com/rgb-color-parser-in-javascript/)

Optional:
 * [jQuery.multiselect](http://www.erichynds.com/blog/jquery-ui-multiselect-widget)

#Loading data

Importing serialized (JSON-LD or turtle) rdf triples into balloon Synopsis can be archived via HTML5 File API, an ajax call or direct input. For that purpose the plugin features a set of methods:

| Method        | Parameters |  Description |
| ------------- |:-------------:|-------------|
| insertData | DATA, SerializationType | Insert data directly |
| insertDataPath | Path, SerializationType | Use ajax call to read file (care about cross domain restrictions)|
| insertDataFile | File | parse given file |
| insertRemoteDataQuery | ServiceURL, Query | Query SPARQL-Service at given URL and insert data of resultset |

Binding maps of the SPARQL query result sets must contain a binding for subject predicate and object.<br/> (*SELECT DISTINCT ?subject ?predicate ?object...*)


# Extending balloon Synopsis

There are different means to extend ballon Synopsis. Some of them can be applied by adding stuff to the options object of ballon Synopsis. The options object is essentially structured as follows.

    options : {
      rdfstoreOptions : {},   // rdfstore-js options
      layerOptions : {      // Options for Layers (Overlays)
        nodeFilters : {},     // Filters to use on node objectss
        tileFilters : {},   // Filters to use on tiles
        modelOptions : {},    // Options for model
        remoteOptions : {},   // Options for remote loading of data
        viewOptions : {     // Options for view components
          layoutEngine : {} // Isotope options object
        }
      }
    }

### Adding sorting functionalities

Sorting of the tiles is handled by Isotope. Therefore new sort methods can be added to balloon Synopsis as described in the [isotope sort tutorial](http://isotope.metafizzy.co/sorting.html). This can be accomplised by modifying the *options.layerOptions.viewOptions.layoutEngine* object, which equates to the isotope options.

### Adding new node and tile filters

Tile and node filters can be used to change the style of presentation of given nodes and even load new data. While node filters are utilized on the abstract nodes before they are being translated to DOM objects, tile filters are executed on the resulting tiles of the templating mechanism. This seperates the filers into conceptual and visual tuning.

ballon Synopsis distinguishes between three base node types:

1. **Literal nodes** are nodes representing literals of the by the layer represented resource.
2. **Blank nodes** are nodes to represent a blank node.
3. **Res nodes ** are nodes to represent all other related objects.

These nodes and their attributes can be accessed by filters. Filters consist of a function part *fn* and a configuration part *config*. The function is executed on a list of nodes, while the config should hold the configurable variables of the filter.

    expandNodes : {
      fn : function(nodes, config) {
        $.each(nodes, function(i, node) {
              node.style.width += config.increment;
        });
          return nodes;
      },
      config : {
        increment : 100;
      }
    }
After working with the nodes a filter function has to return them. Nodes can be deleted and added to the list at will like shown in the **blacklistURI** filter.

    /**
     * Filters blacklisted resources defined by URIs in config options.
     * Only RegEx allowed.
     * 
     * @property defaults.nodeFilters.blacklistURI
     * @type Object
     */
    blacklistURI : {
      fn : function(plugin, nodes, config) {
        $.each(nodes, function(i, node) {
          $.each(config, function(j, exp) {
            var res = exp.exec(node.uri);
            if (res !== null) {
              delete nodes[i];
            }
          });
        });
        return nodes;
      },
      config : new Array(/passau/i) //Regex to be filtered
    }

Each node must have an unique *id* and a *type* signifier, which matches generally the name of the node type. New types can be added by changing the *type* signifier of nodes. (**ATTENTION:** The order of filter execution can be important because modifying the node list can affect subsequent filters). It is planed to add synchronous filter execution in prospective balloon Synopsis versions. Therefore filter execution and structure may change in the future.