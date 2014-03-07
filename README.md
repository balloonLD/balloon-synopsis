balloon-synopsis - Visualizing RDF Data
================

**RDF data is online - most RDF visualizer are not**

We see the necessity for an easy-to-use RDF visualizer which everybody can embed in a homepage. Therefore we are developing balloon Synopsis. A node-centric RDF viewer & browser in a modern tile design, available as jQuery-plugin.

balloon Synopsis is part of the balloon project (http://schlegel.github.io/balloon). balloon aims at offering public services and tools to take advantage of the semantic web with less effort. 

Our current prototype offers following features:

* HTML/JavaScript RDF Viewer & Browser
* jQuery Plugin
* Automatic information enhancement (intergration of [balloon Fusion](http://schlegel.github.io/balloon/balloon-fusion.html))
* Configurable Templating (aggregate information for human-friendly view e.g. Google Maps instead of long/lat)
* Timeline (track history of the browsing behaviour)

![balloon Synopsis Screenshot](http://schlegel.github.io/balloon/images/slider/balloon_synopsis.png)


## Installation
The plugin javascript file is located in the build/ folder of the distribution. To use visaRDF just include this file in your page.

## Building
You can use [Grunt](http://gruntjs.com/api/grunt) to generate the template.js from the handlebar files. Grunt concatinates the templates.js and the visaRDF.js.
Grunt and Grunt plugins are installed and managed via npm, the [Node.js](http://nodejs.org/) package manager.
You will need to install following Grunt plugins:

* [grunt-contrib-concat](https://npmjs.org/package/grunt-contrib-concat)
* [grunt-contrib-handlebars](https://npmjs.org/package/grunt-contrib-handlebars)
* [grunt-contrib-uglify](https://npmjs.org/package/grunt-contrib-uglify)
* [grunt-contrib-yuidoc](https://npmjs.org/package/grunt-contrib-yuidoc)

## visaRDF dependencies:

 * [jQuery](http://jquery.com/) 1.8.3
 * [jQuery.isotope](http://isotope.metafizzy.co/)
 * [deepCopy](http://oranlooney.com/deep-copy-javascript/)
 * [jQuery.multiSelect](http://www.erichynds.com/blog/jquery-ui-multiselect-widget)
 * [jQuery.quickFit](https://github.com/chunksnbits/jquery-quickfit)
 * [handlebars](http://handlebarsjs.com/)
 * [modernizr](http://modernizr.com/)
 * [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js)
 * [rgbcolor](http://www.phpied.com/rgb-color-parser-in-javascript/)
