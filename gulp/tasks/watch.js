
var gulp  = require('gulp');
var config= require('../config');

gulp.task('watch', ['setWatch', 'browserify'], function() {
	gulp.watch(config.less.src, ['css']);
});
