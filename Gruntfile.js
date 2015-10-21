module.exports = function (grunt) {

    var CSS;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowerInstall: {
            install: {
                options: {
                    copy: false,
                    layout: 'byType',
                    install: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        copy: {
            worker: {
                files: [
                    {
                        rename: function (dest, src) {
                            console.log( src);
                            if (src) {
                                return dest + "<%= pkg.name %>_" + src;
                            } else {
                                return dest;
                            }
                        },
                        expand: true,
                        cwd: 'src/worker/',
                        src: '**',
                        dest: 'build/',
                        flatten: false
                    }
                ]
            }
        },
        wiredep: {
            target: {
                src: ['demos/*/*.html'],
                fileTypes: {
                    html: {
                        detect: {
                            js: /<script.*src=['"]([^'"]+)/gi,
                            css: /<link.*href=['"]([^'"]+)/gi
                        },
                        replace: {
                            js: '<script type="text/javascript" src="{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="{{filePath}}" />'
                        }
                    }
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    commonjs: true,
                    namespace: false,
                    partialRegex: /^par_/,
                    processName: function (filePath) {
                        var tmp = filePath.split(/[/.]/);
                        return tmp.slice(2, tmp.length - 1).join('.');
                    },
                    processPartialName: function (filePath) {
                        var tmp = filePath.split(/[/.]/);
                        return tmp.slice(2, tmp.length - 1).join('.');
                    }
                },
                files: {
                    "src/js/templates.js": ["src/templates/**/*.handlebars"]
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
                    paths: 'build/',
                    outdir: 'documentation/'
                }
            }
        },
        browserify: {
            test: {
                src: 'spec/*.js',
                dest: 'tmp/specs.js'
            },
            compile: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        jasmine: {
            customTemplate: {
                options: {
                    specs: 'tmp/specs.js',
                    vendor: [
                        "bower_components/jquery/dist/jquery.min.js",
                        "bower_components/handlebars/handlebars.min.js",
                        "bower_components/bows/dist/bows.min.js",
                        "bower_components/rdfstore/dist/rdfstore_min.js",
                        "bower_components/modernizr/modernizr.js",
                        "bower_components/underscore/underscore-min.js",
                        "bower_components/backbone/backbone.js"
                    ]
                }
            }
        },
        clean: {
            tmp: ["tmp"]
        }
    });

    // Load the plugin that provides the "bower" task. (Package dependencies)
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.renameTask('bower', 'bowerInstall');

    // Load the plugin that provides the "grunt-wiredep" task. (Package dependencies script tag injection)
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks('grunt-contrib-copy');

    // Load the plugin that provides the "handlebars" task. (HTML templating)
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    // Load the plugin that provides documentation generation.
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Load the plugin that provides deleting of tmp.
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Load CSS pre-compiler
    grunt.loadNpmTasks('assemble-less');

    // Load qunit testing
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Load variables
    grunt.registerTask('less-config', 'Fetches variables for less class names.', function () {
        var done = this.async();
        CSS = require("./src/js/const/css.js");
        grunt.config.set("less", {
            production: {
                options: {
                    globalVars: CSS
                },
                files: {
                    "./build/css/<%= pkg.name %>.css": "src/less/main.less"
                }
            }
        });
        done();
    });

    // Default task(s).
    grunt.registerTask('default', ['copy', 'less-config', 'bowerInstall', 'less:production', 'handlebars', 'browserify', 'wiredep', 'jasmine', 'yuidoc', 'clean']);
    grunt.registerTask('without_jasmin', ['copy', 'less-config', 'bowerInstall', 'less:production', 'handlebars', 'browserify', 'wiredep', 'yuidoc', 'clean']);
    grunt.registerTask('without_bower', ['copy', 'less-config', 'less:production', 'handlebars', 'browserify', 'jasmine', 'yuidoc', 'clean']);
    grunt.registerTask('without_bower_n_jasmin', ['copy', 'less-config', 'less:production', 'handlebars', 'browserify', 'yuidoc', 'clean']);

};