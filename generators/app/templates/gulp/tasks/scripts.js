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
var lazypipe    = require('lazypipe');

var jsPipeline  = function(filename) {
  var output = path.join(config.build, 'js');

  return lazypipe()
    .pipe(source, filename)
    .pipe(buffer)
    .pipe($.sourcemaps.init, { loadMaps: true })
    .pipe(function() {
      return $.if(config.production, $.uglify());
    })
    .pipe($.sourcemaps.write, output)
    .pipe(gulp.dest, output)
    .pipe($.gzip)
    .pipe(gulp.dest, output);
};

gulp.task('scripts', function(cb) {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', function() {
  var bundler = browserify({
    entries: [ path.join(root, 'source', 'js', 'main.js') ],
    debug: !config.production
  });

  return bundler.bundle().pipe(jsPipeline('main.js'));
});
