/**
 * Project stats gulp tasks
 */
/* jshint node: true */

'use strict';

var path   = require('path');
var root   = path.join(__dirname, '..', '..');
var config = require(path.join(root, 'gulp', 'config'));
var gulp   = require('gulp');
var $      = require('gulp-load-plugins')({ lazy: true });

gulp.task('totalsize', function() {
  return gulp.src(path.join(root, 'source', '**', '*'))
    .pipe($.size({ title: 'everything' }));
});
