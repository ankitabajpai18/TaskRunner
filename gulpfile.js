var gulp = require("gulp");
/*----plugins----*/
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var merge2 = require("merge2");
var notify = require("gulp-notify");
var browserSync = require("browser-sync").create();
var eslint = require("gulp-eslint");
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminMozjpeg = require('imagemin-mozjpeg');
var del = require('del');
/*----plugins----*/

/*----constants----*/
var JS_DISTRIBUTION_FOLDER = "./dist/js";
var CSS_DISTRIBUTION_FOLDER = "./dist/css";
var IMAGES_DISTRIBUTION_FOLDER = "./dist/images";
var HTML_DISTRIBUTION_FOLDER = "./dist/";
var FONT_DISTRIBUTION_FOLDER = "./dist/fonts";
var THIRD_PARTY_CSS = [];
var CUSTOM_CSS = ["./src/scss/style.scss"];
var THIRD_PARTY_JS = [
    "src/js/vendorjs/jquery.min.js",
    "src/js/vendorjs/Tweenmax.js",

];
var CUSTOM_JS = [
    "src/js/customjs/main.js",
];
/*----constants----*/

gulp.task("browser-sync", ["styles", "scripts", "vendorscripts", "imagemin-uploads", "minify", "fonts"], function() {
    browserSync.init({
        server: {
            injectChanges: true,
            baseDir: "./"
        }
    });
});

gulp.task("watch", ["browser-sync"], function() {
    gulp.watch("./src/scss/**/*.scss", ["styles"]).on("change", browserSync.reload);
    gulp.watch("./src/js/customjs/**/*.js", ["scripts"]).on("change", browserSync.reload);
    gulp.watch("./src/js/vendorjs/**/*.js", ["vendorscripts"]).on("change", browserSync.reload);
    gulp.watch("./src/images/**/*.+(jpg|gif|png|svg)", ["imagemin-uploads"]).on("change", browserSync.reload);
    gulp.watch("*.html").on("change", browserSync.reload);
});


gulp.task('minify', function() {
    gulp.src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(HTML_DISTRIBUTION_FOLDER))
});
gulp.task("styles", function() {
    var sequentialCSS = THIRD_PARTY_CSS.concat(CUSTOM_CSS);
    return gulp.src(sequentialCSS)
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("style.css"))
        .pipe(autoprefixer({
            browsers: ["> 1%", "iOS 7", "ie >= 10"],
            cascade: false
        }))
        .pipe(gulp.dest(CSS_DISTRIBUTION_FOLDER))
        .pipe(rename("style.min.css"))
        .pipe(cssnano({ zindex: false }))
        .pipe(gulp.dest(CSS_DISTRIBUTION_FOLDER))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            message: "style.min.css is ready!"
        }));
});

gulp.task('imagemin-uploads', function() {
    var imgDir = './src/images/**/*.+(jpg|gif|png)';
    gulp.src(imgDir)
        .pipe(imagemin(
            [
                imageminGifsicle({
                    //interlaced: true,
                    optimizationLevel: 1
                }),
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                }),
                imageminOptipng(),
                imageminSvgo([{ removeViewBox: false }, { minifyStyles: false }, { removeUselessStrokeAndFill: false }])
            ], { verbose: true }))
        .pipe(gulp.dest(IMAGES_DISTRIBUTION_FOLDER))
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(FONT_DISTRIBUTION_FOLDER))
})



gulp.task("scripts", function() {
    var sequentialJS = CUSTOM_JS.concat(CUSTOM_JS);
    return gulp.src(sequentialJS)
        .pipe(concat("main.js"))
        .pipe(gulp.dest(JS_DISTRIBUTION_FOLDER))
        .pipe(rename("main.min.js"))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulp.dest(JS_DISTRIBUTION_FOLDER))
        .pipe(notify({
            message: "main.min.js is ready!"
        }));
});


gulp.task("vendorscripts", function() {
    var sequentialJS = THIRD_PARTY_JS.concat(THIRD_PARTY_JS);
    return gulp.src(sequentialJS)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(JS_DISTRIBUTION_FOLDER))
        .pipe(rename("vendor.min.js"))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulp.dest(JS_DISTRIBUTION_FOLDER))
        .pipe(notify({
            message: "vendor.min.js is ready!"
        }));
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
})

gulp.task("lint", function() {
    return gulp.src(CUSTOM_JS).pipe(eslint({
            "rules": {
                "quotes": [1, "single"],
                "semi": [1, "always"]
            }
        }))
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failOnError());
});

gulp.task("default", ["styles", "scripts", "vendorscripts", "imagemin-uploads", "fonts", "minify", "watch"]);