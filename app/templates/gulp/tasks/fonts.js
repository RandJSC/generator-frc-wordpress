/**
 * Font Build Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(__dirname, '..', '..', 'secrets.json'));
var helpers     = require(path.join(__dirname, '..', 'lib', 'helpers'));
var chalk       = require('chalk');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');
var lazypipe    = require('lazypipe');

var gzipChannel = lazypipe()
  .pipe(gulp.dest, path.join(config.build, 'fonts'))
  .pipe(function() {
    return $.if(config.production, $.gzip());
  })
  .pipe(function() {
    return $.if(config.production, gulp.dest(path.join(config.build, 'fonts')));
  });

gulp.task('fonts', function(cb) {
  runSequence('fonts:vendor', 'fonts:copy', cb);
});

gulp.task('fonts:vendor', function(cb) {
  if (!config.resources.vendorFonts.length) {
    $.util.log(chalk.cyan('No vendor fonts. Skipping.'));
    cb();
  }

  return gulp.src(config.resources.vendorFonts)
    .pipe(gzipChannel());
});

gulp.task('fonts:copy', function() {
  return gulp.src(config.resources.fonts)
    .pipe(gzipChannel());
});
