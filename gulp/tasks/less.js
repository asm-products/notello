
var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../utils/handleErrors');
var concat    = require('gulp-concat');
var config = require('../config').less;

gulp.task('less', function () {
  	return gulp.src(config.src)
	    .pipe(less())
	    .on('error', handleErrors)
        .pipe(concat(config.filename))
	    .pipe(gulp.dest(config.dest));
});