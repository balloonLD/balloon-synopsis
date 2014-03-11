module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        handlebars: {
            compile: {
                options: {
                    processName: function(filename) {
                        return filename.split('.')[0].split('/')[1];
                    },
                    processPartialName: function(filePath) { // input:  templates/_header.hbs
                        return filePath.split('.')[0].split('/')[1].split('_')[1]; // output: _header.hbs
                    },
                    namespace: "<%= pkg.name %>.templates",
                    partialRegex: /^par_/
                },
                files: {
                    "js/plugin/templates.js": ["templates/*.handlebars"]
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'js/plugin/',
                    outdir: 'documentation/'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/plugin/*.js'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "handlebars" task.
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    // Load the plugin that provides the "concatination" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides documentation generation.
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['handlebars', 'yuidoc', 'concat'/*,'uglify'*/]);

};