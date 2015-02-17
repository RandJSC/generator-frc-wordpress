/**
 * <%= themeName %>
 * Project Gulpfile
 */

/* jshint node: true */

'use strict';

var _           = require('lodash');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var del         = require('del');
var runSequence = require('run-sequence');
var requireDir  = require('require-dir');
var path        = require('path');
var exec        = require('child_process').exec;
var fs          = require('fs');
var chalk       = require('chalk');
var pngcrush    = require('imagemin-pngcrush');
var exorcist    = require('exorcist');
var glob        = require('glob');
var notifier    = require('node-notifier');
var helpers     = require(path.join(__dirname, 'gulp', 'lib', 'helpers.js'));
var secrets     = require(path.join(__dirname, 'secrets.json'));
var config      = require(path.join(__dirname, 'gulp', 'config.js'));

try {
  requireDir(path.join(__dirname, 'gulp', 'tasks'), { recurse: true });
} catch (err) {
  console.error(err);
}

gulp.task('clean', del.bind(null, [ '.tmp', 'build' ]));

gulp.task('config', function(cb) {
  console.log(config);
  return cb();
});

gulp.task('default', function(cb) {
  return runSequence(
    'clean',
    'config',
    cb
  );
});

gulp.task('watch', function() {
  gulp.watch(config.resources.scss,    [ 'styles' ]);
  gulp.watch(config.resources.css,     [ 'copy' ]);
  gulp.watch(config.resources.images,  [ 'images' ]);
  gulp.watch(config.resources.scripts, [ 'scripts' ]);
  gulp.watch(config.resources.php,     [ 'php' ]);
  gulp.watch(config.resources.fonts,   [ 'fonts' ]);
});


module.exports = gulp;
