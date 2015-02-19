/**
 * JavaScript Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var root        = path.join(__dirname, '..', '..');
var config      = require(path.join(root, 'gulp', 'config'));
var helpers     = require(path.join(root, 'gulp', 'lib', 'helpers'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var browserify  = require('browserify');
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

gulp.task('scripts', function(cb) {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', function() {
  var bundler = browserify({
    entries: [ path.join(root, 'source', 'js', 'main.js') ],
    debug: !config.production
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      //.pipe($.if(!config.production, $.sourcemaps.init({ loadMaps: true })))
      .pipe($.if(config.production, $.uglify()))
      .pipe(gulp.dest(path.join(root, 'build', 'js/')));
  };
});
