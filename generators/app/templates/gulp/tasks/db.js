/**
 * Database Synchronization Gulp Tasks
 */

/* jshint node: true */

'use strict';

var path    = require('path');
var config  = require(path.join(__dirname, '..', 'config'));
var secrets = require(path.join(config.root, 'secrets.json'));
var helpers = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var gulp    = require('gulp');
var $       = require('gulp-load-plugins')({ lazy: true });
var _       = require('lodash');
var fs      = require('fs');
var chalk   = require('chalk');

gulp.task('db:up', function() {
  $.util.log(chalk.magenta('Syncing local database up to staging...'));

  var mysqlDump = [
    'mysqldump',
    '--host=<%= dev.mysql.host %>',
    '--port=<%= dev.mysql.port %>',
    '--user="<%= dev.mysql.username %>"',
    '--password="<%= dev.mysql.password %>"',
    '<%= dev.mysql.database %>',
    '|',
    'gzip',
    '>',
    '/tmp/<%= dev.mysql.database %>.sql.gz'
  ];

  var scp = [
    'scp',
    '-P <%= staging.ssh.port %>',
    '/tmp/<%= dev.mysql.database %>.sql.gz',
    '<%= staging.ssh.username %>@<%= staging.ssh.hostname %>:/tmp/'
  ];

  var loadDump = [
    'zcat',
    '/tmp/<%= dev.mysql.database %>.sql.gz',
    '|',
    'mysql',
    '--user="<%= staging.mysql.username %>"',
    '--password="<%= staging.mysql.password %>"',
    '<%= staging.mysql.database %>'
  ];

  var changeUrls = [
    'bin/wp',
    'search-replace',
    '"http://<%= dev.url %>"',
    '"http://<%= staging.url %>"',
    '--path="<%= staging.rsync.public_html %>"'
  ];

  return gulp.src('')
    .pipe(helpers.log(chalk.yellow('Dumping local database')))
    .pipe(helpers.shell(mysqlDump, {}, { quiet: true }))
    .pipe(helpers.log(chalk.yellow('Uploading to staging')))
    .pipe(helpers.shell(scp, {}, { quiet: true }))
    .pipe(helpers.log(chalk.blue('Loading database dump on staging')))
    .pipe(helpers.remoteShell(loadDump, { quiet: true }))
    .pipe(helpers.log(chalk.blue('Changing URLs in database')))
    .pipe(helpers.remoteShell(changeUrls, { quiet: true }))
    .pipe(helpers.log(chalk.green('Done!')));
});

gulp.task('db:down', function() {
  $.util.log(chalk.magenta('Syncing staging database down to localhost...'));

  var isOSX = helpers.isOSX();
  var zcat  = isOSX ? 'gzcat' : 'zcat';

  var mysqlDump = [
    'mysqldump',
    '--user="<%= staging.mysql.username %>"',
    '--password="<%= staging.mysql.password %>"',
    '<%= staging.mysql.database %>',
    '|',
    'gzip',
    '>',
    '/tmp/<%= staging.mysql.database %>.sql.gz'
  ];

  var scp = [
    'scp',
    '-P <%= staging.ssh.port %>',
    '<%= staging.ssh.username %>@<%= staging.ssh.hostname %>:/tmp/<%= staging.mysql.database %>.sql.gz',
    '/tmp/'
  ];

  var loadDump = [
    zcat,
    '/tmp/<%= staging.mysql.database %>.sql.gz',
    '|',
    'mysql',
    '--host="<%= dev.mysql.host %>"',
    '--port="<%= dev.mysql.port %>"',
    '--user="<%= dev.mysql.username %>"',
    '--password="<%= dev.mysql.password %>"',
    '<%= dev.mysql.database %>'
  ];

  var changeUrls = [
    'bin/wp',
    'search-replace',
    '"http://<%= staging.url %>"',
    '"http://<%= dev.url %>"',
    '--path="<%= dev.public_html %>"'
  ];

  return gulp.src('')
    .pipe(helpers.log(chalk.yellow('Dumping remote database')))
    .pipe(helpers.remoteShell(mysqlDump, { quiet: true }))
    .pipe(helpers.log(chalk.yellow('Downloading database dump')))
    .pipe(helpers.shell(scp, {}, { quiet: true }))
    .pipe(helpers.log(chalk.blue('Loading database dump')))
    .pipe(helpers.shell(loadDump, {}, { quiet: true }))
    .pipe(helpers.log(chalk.blue('Changing URLs in database')))
    .pipe(helpers.vagrantCommand(changeUrls, { quiet: true }))
    .pipe(helpers.log(chalk.green('Done!')));
});
