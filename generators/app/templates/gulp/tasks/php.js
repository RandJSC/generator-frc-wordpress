/**
 * PHP Gulp Tasks
 */

/* jshint node: true */

'use strict';

var fs          = require('fs');
var path        = require('path');
var root        = path.join(__dirname, '..', '..');
var config      = require(path.join(root, 'gulp', 'config'));
var helpers     = require(path.join(root, 'gulp', 'lib', 'helpers'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');

gulp.task('php', function(cb) {
  var tasks = [ 'php:copy' ];

  if (fs.existsSync(path.join(root, 'composer.phar')) && fs.existsSync(path.join(root, 'composer.json'))) {
    tasks.push('php:composer');
  }

  tasks.push(cb);

  runSequence.apply(this, tasks);
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
