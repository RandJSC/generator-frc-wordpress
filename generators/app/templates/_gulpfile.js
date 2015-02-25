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
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var helpers     = require(path.join(__dirname, 'gulp', 'lib', 'helpers.js'));
var secrets     = require(path.join(__dirname, 'secrets.json'));
var config      = require(path.join(__dirname, 'gulp', 'config.js'));
var tasks       = path.join(config.root, 'gulp', 'tasks');

try {
  requireDir(tasks, { recurse: true });
} catch (err) {
  console.error(err);
}

gulp.task('clean', del.bind(null, [ path.join(config.root, '.tmp'), config.build ]));

gulp.task('config', function(cb) {
  console.log(config);
  return cb();
});

gulp.task('default', function(cb) {
  return runSequence(
    'clean',
    'copy',
    'fonts',
    'styles',
    'scripts',
    'images',
    'php',
    'totalsize',
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

gulp.task('serve', function() {
  browserSync({
    proxy: secrets.servers.dev.url
  });

  gulp.watch(config.resources.scss,    [ 'styles' ]);
  gulp.watch(config.resources.css,     [ 'copy', reload ]);
  gulp.watch(config.resources.images,  [ 'images', reload ]);
  gulp.watch(config.resources.scripts, [ 'scripts' ]);
  gulp.watch(config.resources.php,     [ 'php', reload ]);
  gulp.watch(config.resources.fonts,   [ 'fonts', reload ]);
});

module.exports = gulp;
