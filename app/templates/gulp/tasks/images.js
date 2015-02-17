/**
 * Image Build Tasks
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
var pngcrush    = require('imagemin-pngcrush');
var runSequence = require('run-sequence').use(gulp);

gulp.task('images', function(cb) {
  runSequence('images:vendor', 'images:optimize', cb);
});

gulp.task('images:vendor', function(cb) {
  if (!config.resources.vendorImages.length) {
    $.util.log(chalk.cyan('No vendor images. Skipping.'));
    return cb();
  }

  return gulp.src(config.resources.vendorImages)
    .pipe(gulp.dest(path.join(config.build, 'img')));
});

gulp.task('images:optimize', function() {
  return gulp.src(config.resources.images)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [ { removeViewBox: false } ],
      use: [ pngcrush() ]
    }))
    .pipe(gulp.dest(path.join(config.build, 'img')))
    .pipe($.size({ title: 'Images' }));
});
