/**
 * Zip Distribution Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path     = require('path');
var config   = require(path.join(__dirname, '..', 'config'));
var helpers  = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var gulp     = require('gulp');
var chalk    = require('chalk');
var $        = require('gulp-load-plugins')({ lazy: true });
var pkg      = require(path.join(config.root, 'package.json'));
var filename = pkg.name + '-v' + pkg.version + '.zip';

gulp.task('zip', function() {
  return gulp.src(path.join(config.build, '**', '*'))
    .pipe(helpers.log(chalk.magenta('Saving to dist/' + filename)))
    .pipe($.zip(filename))
    .pipe(gulp.dest(config.dist));
});
