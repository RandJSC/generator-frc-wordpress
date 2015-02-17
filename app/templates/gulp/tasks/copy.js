/**
 * Copy stuff from source to build unchanged
 */

var path   = require('path');
var gulp   = require('gulp');
var config = require(path.join(__dirname, '..', 'config'));
var $      = require('gulp-load-plugins')({ lazy: true });

gulp.task('copy', function() {
  return gulp.src(config.resources.misc)
    .pipe(gulp.dest(config.build))
    .pipe($.size({ title: 'Copy' }));
});
