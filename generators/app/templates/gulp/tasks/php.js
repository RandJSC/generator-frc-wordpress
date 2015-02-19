/**
 * PHP Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var root        = path.join(__dirname, '..', '..');
var config      = require(path.join(root, 'gulp', 'config'));
var helpers     = require(path.join(root, 'gulp', 'lib', 'helpers'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');

gulp.task('php', function(cb) {
  runSequence('php:copy', 'php:composer', cb);
});

gulp.task('php:copy', function() {
  return gulp.src(config.resources.php)
    .pipe(gulp.dest(config.build))
    .pipe($.size({ title: 'php' }));
});

gulp.task('php:composer', function() {
  return gulp.src('')
    .pipe($.shell('php composer.phar install'));
});
