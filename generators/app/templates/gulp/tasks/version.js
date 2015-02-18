/**
 * Versioning Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path   = require('path');
var root   = path.join(__dirname, '..', '..');
var gulp   = require('gulp');
var config = require(path.join(root, 'gulp', 'config'));
var $      = require('gulp-load-plugins')({ lazy: true });

var bumper = function(type) {
  return function() {
    return gulp.src(config.resources.json)
      .pipe($.bump({ type: type }))
      .pipe(gulp.dest(root));
  };
};

gulp.task('bump:patch', bumper('patch'));
gulp.task('bump:minor', bumper('minor'));
gulp.task('bump:major', bumper('major'));
gulp.task('bump:reset', function() {
  return gulp.src(config.resources.json)
    .pipe($.bump({ version: '0.1.0' }))
    .pipe(gulp.dest(root));
});

