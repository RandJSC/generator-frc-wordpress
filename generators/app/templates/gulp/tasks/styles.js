/**
 * Stylesheet Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(__dirname, '..', '..', 'secrets.json'));
var helpers     = require(path.join(__dirname, '..', 'lib', 'helpers'));
var pipelines   = require(path.join(__dirname, '..', 'lib', 'pipelines'));
var chalk       = require('chalk');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });

var output         = path.join(config.build, 'css');
var productionGzip = pipelines.productionGzip(output);

gulp.task('styles', function() {
  return gulp.src(config.resources.scss)
    .pipe(helpers.log(chalk.yellow('Compiling SCSS')))
    .pipe($.rubySass(config.sass))
    .on('error', helpers.handleError)
    .pipe(gulp.dest(output))
    .pipe(productionGzip())
    .pipe($.size({ title: 'scss' }));
});
