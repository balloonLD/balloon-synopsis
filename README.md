# visaRDF - A jQuery Plugin for RDF visualisation

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