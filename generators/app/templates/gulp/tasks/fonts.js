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
var pipelines   = require(path.join(__dirname, '..', 'lib', 'pipelines'));

var output         = path.join(config.build, 'fonts');
var productionGzip = pipelines.productionGzip(output);

gulp.task('fonts', function(cb) {
  runSequence('fonts:vendor', 'fonts:copy', cb);
});

gulp.task('fonts:vendor', function(cb) {
  if (!config.resources.vendorFonts.length) {
    $.util.log(chalk.cyan('No vendor fonts. Skipping.'));
    cb();
  }

  return gulp.src(config.resources.vendorFonts)
    .pipe(gulp.dest(path.join(output)))
    .pipe(productionGzip());
});

gulp.task('fonts:copy', function() {
  return gulp.src(config.resources.fonts)
    .pipe(gulp.dest(output))
    .pipe(productionGzip());
});
