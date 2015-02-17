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

/*
 * All optimizations are turned on by default. Pass --dev on the CLI to enable
 * the creation of source maps and other things that take up lots of space.
 */
var isProduction = !$.util.env.dev;

/*
 * Gzip config: maximum compression!
 */
var gzipConfig = {
  gzipOptions: {
    level: 9
  }
};

/*
 * Browserify Configuration
 * See https://github.com/substack/node-browserify/blob/master/readme.markdown
 */
var browserifyOpts = {
  debug: !isProduction
};

/*
 * Sass Configuration
 * See https://github.com/sindresorhus/gulp-ruby-sass
 */
var sassOpts = {
  style: isProduction ? 'compressed' : 'expanded',
  lineNumbers: !isProduction,
  debugInfo: !isProduction,
  precision: 10,
  loadPath: [
    path.join(__dirname, 'source', 'css'),
    path.join(__dirname, 'node_modules')
  ]
};

/*
 * Pleeease CSS Postprocessor Configuration
 * See https://github.com/danielhusar/gulp-pleeease
 */
var pleeeaseOpts = {
  browsers: [ 'last 3 versions' ],
  minifier: isProduction ? { preserveHacks: true, removeAllComments: true } : false,
  sourcemaps: false
};

var resources = {
  scss: 'source/css/**/*.scss',
  images: 'source/img/**/*.{png,jpg,gif,svg,jpeg}',
  vendorImages: [],
  svgs: 'source/img/**/*.svg',
  php: 'source/**/*.php',
  fonts: 'source/**/*.{woff,eot,ttf}',
  vendorFonts: [
    'node_modules/font-awesome/fonts/*'
  ],
  json: {
    theme: 'theme.json',
    package: 'package.json',
    composer: 'composer.json'
  },
  scripts: [ 'source/js/**/*.js' ],
  misc: [
    'source/*',
    '!source/*.php',
    './theme.json'
  ]
};

var handleError = function(err) {
  notifier.notify({
    title: 'Gulp Error',
    message: err.message
  });
};

gulp.task('config', function(cb) {
  console.log(config);
  return cb();
});

gulp.task('scripts', function(cb) {
  return cb();
});

gulp.task('vagrant:ssh-config', function(cb) {
  var configPath = path.join(__dirname, 'vagrant-ssh.config');

  if (fs.existsSync(configPath)) {
    $.util.log(chalk.cyan('Vagrant SSH config already exists. Delete it to regenerate.'));
    return cb();
  }

  exec('vagrant ssh-config', function(err, stdout, stderr) {
    if (err) {
      $.util.log(chalk.red('Cannot save Vagrant ssh config unless VM is running! Please run `vagrant up`'));
      return cb();
    }

    fs.writeFile(configPath, stdout, function(err) {
      if (err) {
        $.util.log(chalk.red('Error saving Vagrant SSH config'));
        return cb();
      }

      $.util.log(chalk.green('Vagrant SSH config saved!'));
      return cb();
    });
  });
});

gulp.task('default', function(cb) {
  runSequence('config', cb);
});

try {
  requireDir(path.join(__dirname, 'gulp', 'tasks'), { recurse: true });
} catch (err) {
  console.error(err);
}

module.exports = gulp;
