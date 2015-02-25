/**
 * Staging Synchronization Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path    = require('path');
var config  = require(path.join(__dirname, '..', 'config'));
var secrets = require(path.join(config.root, 'secrets.json'));
var helpers = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var gulp    = require('gulp');
var chalk   = require('chalk');
var $       = require('gulp-load-plugins')({ lazy: true });
var _       = require('lodash');
var staging = secrets.servers.staging.rsync;

var hasValid = function(obj, key) {
  return _.has(obj, key) && !_.isEmpty(obj[key]);
};

var isValidDirection = function(obj, key) {
  return hasValid(obj, key) && (obj[key] === 'up' || obj[key] === 'down');
};

var syncTask = function(opts) {
  var config     = secrets.servers.staging.rsync;
  opts           = _.isObject(opts) ? opts : {};
  opts.source    = hasValid(opts, 'source') ? opts.source : path.join(config.root, 'build/');
  opts.dest      = hasValid(opts, 'dest') ? opts.dest : config.path;
  opts.message   = hasValid(opts, 'message') ? opts.message : 'Beginning sync task';
  opts.direction = isValidDirection(opts, 'direction') ? opts.direction : 'up';

  var rsync = [
    'rsync -avzr',
    '-e "ssh -p <%= staging.ssh.port %>"',
    '--delete'
  ];

  if (opts.direction === 'up') {
    rsync.push('<%= source %>');
    rsync.push('<%= staging.rsync.username %>@<%= staging.rsync.hostname %>:<%= dest %>');
  } else {
    rsync.push('<%= staging.rsync.username %>@<%= staging.rsync.hostname %>:<%= source %>');
    rsync.push('<%= dest %>');
  }

  return function() {
    $.util.log(chalk.magenta(opts.message));

    return gulp.src('')
      .pipe(helpers.shell(rsync, { source: opts.source, dest: opts.dest }));
  };
};

gulp.task('sync:up', syncTask({ message: 'Syncing up to staging...' }));

gulp.task('uploads:up', syncTask({
  source: path.join(config.root, 'uploads/'),
  dest: path.join(staging.public_html, 'wp-content', 'uploads/'),
  message: 'Syncing uploads UP...'
}));

gulp.task('uploads:down', syncTask({
  source: path.join(staging.public_html, 'wp-content', 'uploads/'),
  dest: path.join(config.root, 'uploads/'),
  message: 'Syncing uploads DOWN...',
  direction: 'down'
}));

gulp.task('plugins:up', syncTask({
  source: path.join(config.root, 'plugins/'),
  dest: path.join(staging.public_html, 'wp-content', 'plugins/'),
  message: 'Syncing plugins UP...',
  direction: 'up'
}));

gulp.task('plugins:down', syncTask({
  source: path.join(staging.public_html, 'wp-content', 'plugins/'),
  dest: path.join(config.root, 'plugins/'),
  message: 'Syncing plugins DOWN...',
  direction: 'down'
}));
