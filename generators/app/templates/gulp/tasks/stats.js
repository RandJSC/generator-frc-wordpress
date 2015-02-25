/**
 * Project stats gulp tasks
 */
/* jshint node: true */

'use strict';

var path   = require('path');
var config = require(path.join(__dirname, '..', 'config'));
var gulp   = require('gulp');
var $      = require('gulp-load-plugins')({ lazy: true });

gulp.task('totalsize', function() {
  return gulp.src(path.join(config.root, 'source', '**', '*'))
    .pipe($.size({ title: 'everything' }));
});
