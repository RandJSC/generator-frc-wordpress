/**
 * JavaScript Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var root        = path.join(__dirname, '..', '..');
var config      = require(path.join(root, 'gulp', 'config'));
var helpers     = require(path.join(root, 'gulp', 'lib', 'helpers'));
var pipelines   = require(path.join(root, 'gulp', 'lib', 'pipelines'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var browserify  = require('browserify');
var babelify    = require('babelify');
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var jsTask      = function(filename) {
  return function() {
    var bundler = browserify({
      entries: [ path.join(root, 'source', 'js', filename) ],
      debug: !config.production
    }).transform(babelify);

    return bundler.bundle()
      .pipe(pipelines.javascript(filename)())
      .pipe(reload({ stream: true }));
  };
};

gulp.task('scripts', function(cb) {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', jsTask('main.js'));
