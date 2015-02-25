/**
 * PHP Gulp Tasks
 */

/* jshint node: true */

'use strict';

var fs          = require('fs');
var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var helpers     = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');

gulp.task('php', function(cb) {
  var tasks = [ 'php:copy' ];
  var json  = config.composer.replace('.phar', '.json');

  if (fs.existsSync(config.composer) && fs.existsSync(json)) {
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
