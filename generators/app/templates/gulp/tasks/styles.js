/**
 * Stylesheet Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(config.root, 'secrets.json'));
var theme       = require(path.join(config.root, 'theme.json'));
var helpers     = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var pipelines   = require(path.join(config.root, 'gulp', 'lib', 'pipelines'));
var chalk       = require('chalk');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var reload      = browserSync.reload;

var output         = path.join(config.build, 'css');
var productionGzip = pipelines.productionGzip(output);

gulp.task('styles', function(cb) {
  runSequence('styles:scss', 'styles:theme', cb);
});

gulp.task('styles:scss', function() {
  return $.rubySass(path.join(config.src, 'css/'), config.sass)
    .on('error', helpers.handleError)
    .pipe($.pleeease(config.pleeease))
    .pipe(productionGzip())
    .pipe($.size({ title: 'scss' }))
    .pipe(reload({ stream: true }));
});

gulp.task('styles:theme', function() {
  var stylesheet = path.join(config.src, 'style.css');

  return gulp.src(stylesheet)
    .pipe($.template(theme))
    .pipe(gulp.dest(config.build));
});
