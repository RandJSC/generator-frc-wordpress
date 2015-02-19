/**
 * Zip Distribution Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path     = require('path');
var root     = path.join(__dirname, '..', '..');
var config   = require(path.join(root, 'gulp', 'config'));
var helpers  = require(path.join(root, 'gulp', 'lib', 'helpers'));
var gulp     = require('gulp');
var chalk    = require('chalk');
var $        = require('gulp-load-plugins')({ lazy: true });
var pkg      = require(path.join(root, 'package.json'));
var filename = pkg.name + '-v' + pkg.version + '.zip';
var dist     = path.join(root, 'dist/');

gulp.task('zip', function() {
  return gulp.src(path.join(config.build, '**', '*'))
    .pipe(helpers.log(chalk.magenta('Saving to dist/' + filename)))
    .pipe($.zip(filename))
    .pipe(gulp.dest(dist));
});
