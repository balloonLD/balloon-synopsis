module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		handlebars : {
			compile : {
				options : {
					processName : function(filename) {
						return filename.split('.')[0].split('/')[1];
					},
					processPartialName : function(filePath) { // input:  templates/_header.hbs
						return filePath.split('.')[0].split('/')[1].split('_')[1]; // output: _header.hbs
					},
					namespace : "<%= pkg.name %>.templates",
					partialRegex : /^par_/
				},
				files : {
					"js/templates.js" : [ "templates/filterOptions.handlebars", "templates/groupDropDown.handlebars",
							"templates/isotopeElements.handlebars", "templates/overlayContent.handlebars", "templates/overlayElement.handlebars",
							"templates/previewElement.handlebars", "templates/sortOptions.handlebars", "templates/par_isotopeElement.handlebars",
							"templates/par_isotopeElementContent.handlebars" ]
				}
			}
		},
		concat : {
			options : {
				separator : ';'
			},
			dist : {
				src : [ 'js/*.js' ],
				dest : 'build/<%= pkg.name %>.js'
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'build/<%= pkg.name %>.js',
				dest : 'build/<%= pkg.name %>.min.js'
			}
		}
	});

	// Load the plugin that provides the "handlebars" task.
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	// Load the plugin that provides the "concatination" task.
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Load the plugin that provides the "uglify" task.
	//grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', [ 'handlebars', 'concat' ]);

};