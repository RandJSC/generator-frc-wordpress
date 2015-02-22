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
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('scripts', function(cb) {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', function() {
  var bundler = browserify({
    entries: [ path.join(root, 'source', 'js', 'main.js') ],
    debug: !config.production
  });

  return bundler.bundle()
    .pipe(pipelines.javascript('main.js')())
    .pipe(reload({ stream: true }));
});
