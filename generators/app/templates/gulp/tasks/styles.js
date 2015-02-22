/**
 * Stylesheet Tasks
 */

/* jshint node: true */

'use strict';

var path        = require('path');
var root        = path.join(__dirname, '..', '..');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(__dirname, '..', '..', 'secrets.json'));
var helpers     = require(path.join(__dirname, '..', 'lib', 'helpers'));
var pipelines   = require(path.join(__dirname, '..', 'lib', 'pipelines'));
var chalk       = require('chalk');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var output         = path.join(config.build, 'css');
var productionGzip = pipelines.productionGzip(output);

gulp.task('styles', function() {
  return $.rubySass(path.join(root, 'source', 'css/'), {
    precision: 10,
    style: config.production ? 'compressed' : 'expanded',
    lineNumbers: !config.production,
    loadPath: [
      path.join(root, 'node_modules'),
      path.join(root, 'source', 'css')
    ].join(':')
  })
  .on('error', helpers.handleError)
  .pipe(productionGzip())
  .pipe($.size({ title: 'scss' }))
  .pipe(reload({ stream: true }));
});
