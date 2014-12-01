
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var config = require('../config').css;
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var handleErrors = require('../utils/handleErrors');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');

gulp.task('css', ['less'], function () {

    var processors = [
        autoprefixer({browsers: ['last 2 version']}),
        mqpacker
        // csswring TODO: This is what everyone uses but I keep getting errors so for now I am using gulp-minify-css
    ];

    return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(minifyCSS())
	    .on('error', handleErrors)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
