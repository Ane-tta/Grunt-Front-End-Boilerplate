module.exports = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Define reusable path
        paths: {
            app: 'app',
            app_css: '<%= paths.app %>/css',
            app_js: '<%= paths.app %>/js',
            app_img: '<%= paths.app %>/images',
            source_styl: '<%= paths.app %>/src/styl',
            source_js: '<%= paths.app %>/src/js',
            source_bower: '<%= paths.app %>/src/bower',
            dist: 'dist',
            dist_js: '<%= paths.dist %>/js',
            dist_img: '<%= paths.dist %>/images',
            dist_css: '<%= paths.dist %>/css',
        },

        stylus: {
            dev: {
                options: {
                    compress: false
                },
                files: {
                    '<%= paths.app_css %>/styles.css': '<%= paths.source_styl %>/app.styl'
                }
            },
            build: {
                options: {
                    compress: true
                },
                files: {
                    '<%= paths.dist_css %>/styles.css': '<%= paths.app_css %>/styles.css'
                }
            }
        },

        browserSync: {
            files: {
                src: ['<%= paths.app %>/*.html', '<%= paths.app_css %>/*.css', '<%= paths.app_js %>/*.js']
            },
            options: {
                browser: 'chrome',
                server: '<%= paths.app %>',
                watchTask: true
            }
        },

        watch: {
            stylus: {
                files: ['<%= paths.source_styl %>/**/*.styl'],
                tasks: ['stylus:dev', 'concat:css']
            },
            js: {
                files: ['<%= paths.source_js %>/*.js'],
                tasks: ['jshint', 'uglify:dev']
            }
        },

        jshint: {
            dev: {
                files: {
                    src: '<%= paths.source_js %>/*.js'
                }
            },
            options: {
                reporter: require('jshint-stylish')
            }
        },

        bower: {
            dev: {
                dest: '<%= paths.source_bower %>',
                js_dest: '<%= paths.source_bower %>/js',
                css_dest: '<%= paths.source_bower %>/styles',
            }
        },

        concat: {
            css: {
                src: ['<%= paths.source_bower %>/styles/**/*.css', '<%= paths.app_css %>/styles.css'],
                dest: '<%= paths.app_css %>/styles.css'
            }
        },

        uglify: {
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                src: ['<%= paths.source_bower %>/js/**/*.js', '<%= paths.source_js %>/*.js'],
                dest: '<%= paths.app_js %>/scripts.js'
            },
            build: {
                src: ['<%= paths.source_bower %>/js/**/*.js', '<%= paths.source_js %>/*.js'],
                dest: '<%= paths.dist_js %>/scripts.js'
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: '<%= paths.app %>',
                src: '*.html',
                dest: '<%= paths.dist %>',
                option: {
                    process: (content, srcpath) => {
                        return content.replace('scripts.js', 'scripts.min.js');
                    }
                }
            }
        },

        clean: {
            dist: {
                src: '<%= paths.dist %>'
            }
        },

        imagemin: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.app_img %>',
                        src: ['**/*.{png,jpg,gif,svg,ico}'],
                        dest: '<%= paths.dist_img %>'
                    }
                ]
            }
        }


    });

    //Load the plugins

    //BrowserSync
    grunt.loadNpmTasks('grunt-browser-sync');

    //Stylus
    grunt.loadNpmTasks('grunt-contrib-stylus');

    //Watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Jshint
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //Grunt-Bower
    grunt.loadNpmTasks('grunt-bower');

    //Concat
    grunt.loadNpmTasks('grunt-contrib-concat');

    //Uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Copy
    grunt.loadNpmTasks('grunt-contrib-copy');

    //Clean
    grunt.loadNpmTasks('grunt-contrib-clean');

    //Imagemin
    grunt.loadNpmTasks('grunt-contrib-imagemin');


    //Create tasks

    //Default task
    grunt.registerTask('default', ['browserSync', 'watch']);

    //Build task
    grunt.registerTask('build', ['clean:dist', 'copy', 'imagemin', 'uglify:build', 'concat:css', 'stylus:build']);

};
