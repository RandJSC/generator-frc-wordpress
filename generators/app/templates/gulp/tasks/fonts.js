/**
 * Font Build Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(config.root, 'secrets.json'));
var helpers     = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var pipelines   = require(path.join(config.root, 'gulp', 'lib', 'pipelines'));
var chalk       = require('chalk');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var runSequence = require('run-sequence');

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
    .pipe(productionGzip());
});

gulp.task('fonts:copy', function() {
  return gulp.src(config.resources.fonts)
    .pipe(productionGzip());
});
