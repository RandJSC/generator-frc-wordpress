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

module.exports = {
  productionGzip: function(output) {
    return lazypipe()
      .pipe(function() {
        return $.if(config.production, $.gzip(config.gzip));
      })
      .pipe(function() {
        return $.if(config.production, gulp.dest(output));
      });
  }
};
