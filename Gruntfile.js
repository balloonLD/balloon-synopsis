module.exports = function(grunt) {
	
	var DEBUG = true;
	var F_SELECT = true;

	// Project configuration.
	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				bower : {
					install : {
						options : {
							targetDir : './js/lib',
							layout : 'byType',
							install : true,
							verbose : false,
							cleanTargetDir : false,
							cleanBowerDir : false,
							bowerOptions : {}
						}
					}
				},
				bowerInstall : {

					target : {

						// Point to the files that should be updated when
						// you run `grunt bower-install`
						src : [ 'demos/*/*.html' // .html support...
						],
					}
				},
				copy : {
					main : {
						files : [
						{
							expand : true,
						    cwd: 'templates/raw/',
							src : '**',
							dest : 'templates/preprocessed/',
							flatten : false
						},
						{
							expand : true,
						    cwd: 'js/raw/',
							src : '**',
							dest : 'js/plugin/',
							flatten : false
						}
						
						]
					}
				},
				preprocess : {
					options : {
						context : {
							DEBUG : DEBUG,
							F_SELECT : F_SELECT
						}
					},
					inline : {
						src : [ 'templates/preprocessed/*.handlebars', 'js/plugin/bSynopsis.js'],
						options : {
							inline : true
						}
					},
					bower : {
						src : "bowerRaw.json",
						dest : "bower.json"
					}
				},
				handlebars : {
					compile : {
						options : {
							processName : function(filename) {
								console.log()
								return filename.split('.')[0].split('/')[2];
							},
							processPartialName : function(filePath) { // input:  templates/_header.hbs
								return filePath.split('.')[0].split('/')[1]
										.split('_')[1]; // output: _header.hbs
							},
							namespace : "<%= pkg.name %>.templates",
							partialRegex : /^par_/
						},
						files : {
							"js/plugin/templates.js" : [ "templates/preprocessed/*.handlebars" ]
						}
					}
				},
				yuidoc : {
					compile : {
						name : '<%= pkg.name %>',
						description : '<%= pkg.description %>',
						version : '<%= pkg.version %>',
						url : '<%= pkg.homepage %>',
						options : {
							paths : 'js/plugin/',
							outdir : 'documentation/'
						}
					}
				},
				concat : {
					options : {
						separator : ';'
					},
					dist : {
						src : [ 'js/plugin/*.js' ],
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

	// Load the plugin that provides the "bower" task. (Package dependencies)
	grunt.loadNpmTasks('grunt-bower-task');

	// Load the plugin that provides the "bower" task. (Package dependencies script tag injection)
	grunt.loadNpmTasks('grunt-bower-install');

	// Used to copy templates before inline preprocessing
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Load the plugin that provides the preprocess task. (ifdefs)
	grunt.loadNpmTasks('grunt-preprocess');

	// Load the plugin that provides the "handlebars" task. (HTML templating)
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	// Load the plugin that provides the "concatination" task. (javascript file concatination)
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Load the plugin that provides documentation generation.
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['copy', 'preprocess', 'bower', 'bowerInstall', 'handlebars', 'yuidoc', 'concat', 'uglify']);

};