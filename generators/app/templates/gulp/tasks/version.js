/**
 * Versioning Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path   = require('path');
var config = require(path.join(__dirname, '..', 'config'));
var gulp   = require('gulp');
var $      = require('gulp-load-plugins')({ lazy: true });

var bumper = function(type) {
  return function() {
    return gulp.src(config.resources.json)
      .pipe($.bump({ type: type }))
      .pipe(gulp.dest(config.root));
  };
};

gulp.task('bump:patch', bumper('patch'));
gulp.task('bump:minor', bumper('minor'));
gulp.task('bump:major', bumper('major'));
gulp.task('bump:reset', function() {
  return gulp.src(config.resources.json)
    .pipe($.bump({ version: '0.1.0' }))
    .pipe(gulp.dest(config.root));
});

