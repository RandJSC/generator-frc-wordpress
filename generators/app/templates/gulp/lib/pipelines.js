/**
 * Gulp Shared Pipelines
 */

/* jshint node: true */

'use strict';

var path     = require('path');
var gulp     = require('gulp');
var config   = require(path.join(__dirname, '..', 'config'));
var lazypipe = require('lazypipe');
var $        = require('gulp-load-plugins')({ lazy: true });
var source   = require('vinyl-source-stream');
var buffer   = require('vinyl-buffer');

var pipelines = {};

pipelines.productionGzip = function(output) {
  return lazypipe()
    .pipe(gulp.dest, output)
    .pipe(function() {
      return $.if(config.production, $.gzip(config.gzip));
    })
    .pipe(function() {
      return $.if(config.production, gulp.dest(output));
    });
};

pipelines.javascript = function(filename) {
  var output = path.join(config.build, 'js');

  return lazypipe()
    .pipe(source, filename)
    .pipe(buffer)
    .pipe($.sourcemaps.init, { loadMaps: true })
    .pipe(function() {
      return $.if(config.production, $.uglifyjs());
    })
    .pipe($.sourcemaps.write, output)
    .pipe(pipelines.productionGzip(output));
};

module.exports = pipelines;
