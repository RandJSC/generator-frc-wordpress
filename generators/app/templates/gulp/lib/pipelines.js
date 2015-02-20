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

module.exports = {
  productionGzip: function(output) {
    return lazypipe()
      .pipe(function() {
        return $.if(config.production, $.gzip(config.gzip));
      })
      .pipe(function() {
        return $.if(config.production, gulp.dest(output));
      });
  },
  javascript: function(filename) {
    var output = path.join(config.build, 'js');

    return lazypipe()
      .pipe(source, filename)
      .pipe(buffer)
      .pipe($.sourcemaps.init, { loadMaps: true })
      .pipe(function() {
        return $.if(config.production, $.uglifyjs());
      })
      .pipe($.sourcemaps.write, output)
      .pipe(gulp.dest, output)
      .pipe($.gzip)
      .pipe(gulp.dest, output);
  }
};
