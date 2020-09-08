module.exports = function(grunt) {
    //
    // Paths
    //

    /**
     * with trailing slash
     * bower_components/ (mostly)
     * @type {string}
     */
    //let path_bower = 'bower_components/';
    /**
     * with trailing slash
     * vendor/ (mostly)
     * @type {string}
     */

    let THIRD_PARTY_JS = [
      // 'app/design/frontend/Spaces/theme/web/js/vendorjs/Event.js',
      'app/design/frontend/Spaces/theme/web/js/vendorjs/pinch-zoom.js',
      // 'app/design/frontend/Spaces/theme/web/js/vendorjs/Magnifier.js',
      // 'app/design/frontend/Spaces/theme/web/js/vendorjs/jquery.min.js',
      // 'app/design/frontend/Spaces/theme/web/js/vendorjs/slick.min.js',
      // 'app/design/frontend/Spaces/theme/web/js/vendorjs/nouislider.js',
    ]

    /**
     * This folder will be watched and JS concated, mangled, minified
     *
     * with trailing slash
     * @type {string}
     */
    let CUSTOM_JS = [
      'app/design/frontend/Spaces/theme/web/js/customjs/main.js',
      'app/design/frontend/Spaces/theme/web/js/customjs/home1.js',
      'app/design/frontend/Spaces/theme/web/js/customjs/home2.js',
      // 'app/design/frontend/Spaces/theme/web/js/customjs/base.js',
      // 'app/design/frontend/Spaces/theme/web/js/customjs/suggestor.js',
      // 'app/design/frontend/Spaces/theme/web/js/customjs/sticky-sidebar.js',


    ]
    /**
     * The folder in which the JS output should be saved
     *
     * with trailing slash
     * @type {string}
     */

    let JS_DISTRIBUTION_FOLDER = 'pub/media/spaces/js/';

    /**
     * The main Sass file that should be transpiled, but:
     *
     * without extension
     * @type {string}
     */
    let CUSTOM_CSS = 'app/design/frontend/Spaces/theme/web/less/_style';
    /**
     * The folder where most less files are located, will be used for the CSS file watcher
     *
     * with trailing slash
     * @type {string}
     */
    let CUSTOM_CSS_DIR = 'app/design/frontend/Spaces/theme/web/less/';
    /**
     * The folder in which the CSS should be saved
     *
     * with trailing slash
     * @type {string}
     */

    let CSS_DISTRIBUTION_FOLDER = 'pub/media/spaces/css/';

    /**
     * Name of the CSS file, but:
     *
     * without extension
     * @type {string}
     */
    let CSS_PATHBUILD_FILE = 'style';

    /**
     * The source image folder, will be watched and all images optimized and copied into IMAGE_BUILD
     *
     * with trailing slash
     * @type {string}
     */
    let IMAGE = 'app/design/frontend/Spaces/theme/web/images/';
    /**
     * The folder in which the optimized images are saved
     *
     * with trailing slash
     * @type {string}
     */
    let IMAGE_BUILD = 'pub/media/spaces/images';

    //
    // JS concat
    //

    let js_concat = [
        //path_bower + 'jQuery/dist/jquery.min.js',
        THIRD_PARTY_JS,
        CUSTOM_JS
    ];

    //
    // Options
    //

    /**
     * imagemin level of optimization for png and dynamic (svg|gif)
     * @type {number}
     */
    let img_optimization_lvl = 3;
    /**
     * imagemin level of builded image quality for jpeg and dynamic (svg|gif)
     * @type {number}
     */
    let img_quality_lvl = 90;

    //
    // Watcher
    //

    /**
     * The more files must be scanned the longer it takes, keep the list clean!
     * @type {[*]}
     */
    let watch_css = [
        CUSTOM_CSS_DIR + '**/*.less',
        '!**/node_modules/**',
        '!**/*.min.css'
    ];
    /**
     * The more files must be scanned the longer it takes, keep the list clean!
     * @type {[*]}
     */
    let watch_js = [
        THIRD_PARTY_JS,
        CUSTOM_JS,
        '!**/node_modules/**',
        '!**/*.min.js'
    ];
    /**
     * The more files must be scanned the longer it takes, keep the list clean!
     * @type {[*]}
     */
    let watch_img = [
        IMAGE + '**/*.{gif,svg,png,jpg}',
    ];

    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // JS
        concat: {
            dist: {
                // warns when something was not found but was specified
                nonull: true,
                src: js_concat,
                dest: JS_DISTRIBUTION_FOLDER + 'main.js'
            }
        },
        uglify: {
            build: {
                options: {
                    sourceMap: true,
                    sourceMapName : JS_DISTRIBUTION_FOLDER + 'main.js.map',
                    mangle: true,
                    compress: true
                },
                src: JS_DISTRIBUTION_FOLDER + 'main.js',
                dest: JS_DISTRIBUTION_FOLDER + 'main.min.js'
            }
        },

        // CSS
        less: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    [CSS_DISTRIBUTION_FOLDER + CSS_PATHBUILD_FILE + '.css']: CUSTOM_CSS + '.less'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: CSS_DISTRIBUTION_FOLDER,
                    src: [CSS_PATHBUILD_FILE + '.css', '!' + CSS_PATHBUILD_FILE + '.css.map'],
                    dest: CSS_DISTRIBUTION_FOLDER,
                    ext: '.min.css'
                }]
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [

                    require('autoprefixer')({'overrideBrowserslist': 'last 4 versions'})
                ]
            },
            dist: {
                src: CSS_DISTRIBUTION_FOLDER + CSS_PATHBUILD_FILE + '.min.css'
            }
        },

        // Image
        imagemin: {
            png: {
                options: {
                    optimizationLevel: img_optimization_lvl
                },
                files: [{
                    expand: true,
                    cwd: IMAGE,
                    src: ['**/*.png'],
                    dest: IMAGE_BUILD
                }]
            },
            jpg: {
                options: {
                    quality: img_quality_lvl,
                    progressive: true,
                    use: [require('imagemin-mozjpeg')()]
                },
                files: [{
                    expand: true,
                    cwd: IMAGE,
                    src: ['**/*.jpg'],
                    dest: IMAGE_BUILD
                }]
            },
            dynamic: {
                options: {
                    optimizationLevel: img_optimization_lvl,
                    quality: img_quality_lvl,
                    svgoPlugins: [{removeViewBox: false}]
                },
                files: [{
                    expand: true,
                    cwd: IMAGE,
                    src: ['**/*.{gif,svg}'],
                    dest: IMAGE_BUILD
                }]
            }
        },

        // Multi Tasking
        concurrent: {
            image: ['imagemin:png', 'imagemin:jpg', 'imagemin:dynamic'],
            build: [['js'], ['css'], 'concurrent:image']
        },

        // JS and CSS/Sass file watcher
        watch: {
            css: {
                files: watch_css,
                tasks: ['css']
            },
            js: {
                files: watch_js,
                tasks: ['js']
            },
            image: {
                files: watch_img,
                tasks: ['image']
            }
        }
    });

    // Multi-Thread Task Runner
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // JS
    grunt.registerTask('js', ['concat', 'uglify']);

    // SASS
    grunt.registerTask('css', ['less', 'cssmin', 'postcss']);

    // Images
    grunt.registerTask('image', ['concurrent:image']);

    // Build All
    grunt.registerTask('build', ['concurrent:build']);
};
