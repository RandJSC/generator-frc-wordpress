/**
 * Database Synchronization Gulp Tasks
 */

/* jshint node: true */

'use strict';

var fs          = require('fs');
var path        = require('path');
var config      = require(path.join(__dirname, '..', 'config'));
var secrets     = require(path.join(config.root, 'secrets.json'));
var helpers     = require(path.join(config.root, 'gulp', 'lib', 'helpers'));
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({ lazy: true });
var _           = require('lodash');
var fs          = require('fs');
var chalk       = require('chalk');
var runSequence = require('run-sequence');

var sshConfig = {
  ignoreErrors: false,
  sshConfig: {
    host: secrets.servers.staging.ssh.hostname,
    port: parseInt(secrets.servers.staging.ssh.port, 10),
    username: secrets.servers.staging.ssh.username,
    privateKey: fs.readFileSync(path.join(process.env.HOME, '.ssh', 'id_rsa'))
  }
};

var templateVars = {
  dev: secrets.servers.dev,
  staging: secrets.servers.staging
};

gulp.task('db:up', function(cb) {
  if (!helpers.vagrantRunning()) {
    $.util.log(chalk.bold(chalk.red('Please start Vagrant VM before running this task!')));
    return cb();
  }

  runSequence(
    'db:up:dump',
    'db:up:copy',
    'db:up:load',
    'db:up:urls',
    cb
  );
});

gulp.task('db:up:dump', function() {
  $.util.log(chalk.magenta('Dumping local database'));

  var command = _.template([
    'mysqldump',
    '--host="<%= dev.mysql.host %>"',
    '--port="<%= dev.mysql.port %>"',
    '--user="<%= dev.mysql.username %>"',
    '--password="<%= dev.mysql.password %>"',
    '<%= dev.mysql.database %>',
    '|',
    'gzip',
    '>',
    '/tmp/<%= dev.mysql.database %>.sql.gz'
  ].join(' '))(templateVars);

  return gulp.src('', { read: false })
    .pipe($.shell(command, { quiet: true }));
});

gulp.task('db:up:copy', function() {
  var ssh  = $.ssh(sshConfig);
  var dump = '/tmp/' + secrets.servers.dev.mysql.database + '.sql.gz';

  $.util.log(chalk.magenta('Uploading development database'));

  return gulp.src(dump)
    .pipe(ssh.sftp('write', dump));
});

gulp.task('db:up:load', function() {
  var ssh     = $.ssh(sshConfig);
  var dump    = '/tmp/' + secrets.servers.dev.mysql.database + '.sql.gz';
  var command = _.template([
    'zcat',
    dump,
    '|',
    'mysql',
    '--login-path="local"',
    '--user="<%= staging.mysql.username %>"',
    '<%= staging.mysql.database %>'
  ].join(' '))(templateVars);

  $.util.log(chalk.magenta('Loading staging database'));

  return ssh.exec(command);
});

gulp.task('db:up:urls', function() {
  var ssh     = $.ssh(sshConfig);
  var command = _.template([
    '/home/frcweb/bin/wp',
    'search-replace',
    '"http://<%= dev.url %>"',
    '"http://<%= staging.url %>"',
    '--path="<%= staging.rsync.public_html %>"'
  ]);

  return ssh.exec(command, { filePath: 'wp-cli.staging.log' }).pipe(gulp.dest('logs/'));
});

gulp.task('db:down', function(cb) {
  if (!helpers.vagrantRunning()) {
    $.util.log(chalk.bold(chalk.red('Please start Vagrant VM before running this task!')));
    return cb();
  }

  runSequence(
    'db:down:dump',
    'db:down:copy',
    'db:down:load',
    'db:down:urls',
    cb
  );
});

gulp.task('db:down:dump', function() {
  var ssh = $.ssh(sshConfig);

  var command = _.template([
    'mysqldump',
    '--login-path="local"',
    '--user="<%= staging.mysql.username %>"',
    '<%= staging.mysql.database %>',
    '|',
    'gzip',
    '>',
    '/tmp/<%= staging.mysql.database %>.sql.gz'
  ].join(' '))(templateVars);

  $.util.log(chalk.magenta('Dumping remote database'));

  return ssh.exec(command);
});

gulp.task('db:down:copy', function() {
  var ssh = $.ssh(sshConfig);

  $.util.log(chalk.magenta('Downloading remote database dump'));

  return ssh.sftp('read', '/tmp/' + templateVars.staging.mysql.database + '.sql.gz')
    .pipe($.rename({ dirname: '' }))
    .pipe(gulp.dest('/tmp/'));
});

gulp.task('db:down:load', function() {
  $.util.log(chalk.magenta('Loading database dump into development VM'));

  var zcat    = helpers.isOSX() ? 'gzcat' : 'zcat';
  var dump    = '/tmp/' + secrets.servers.staging.mysql.database + '.sql.gz';
  var loadCmd = _.template([
    'mysql',
    '--host="<%= dev.mysql.host %>"',
    '--port="<%= dev.mysql.port %>"',
    '--user="<%= dev.mysql.username %>"',
    '--password="<%= dev.mysql.password %>"',
    '<%= dev.mysql.database %>'
  ].join(' '))(templateVars);

  var command = zcat + ' <%= file.path %> ' + ' | ' + loadCmd;

  return gulp.src(dump, { read: false })
    .pipe($.shell(command, { quiet: true }));
});

gulp.task('db:down:urls', function() {
  var ssh = $.ssh({
    ignoreErrors: false,
    sshConfig: {
      host: '127.0.0.1',
      port: 2222,
      username: 'vagrant',
      privateKey: fs.readFileSync(config.vagrantKey)
    }
  });

  var command = _.template([
    '/home/vagrant/bin/wp',
    'search-replace',
    '"http://<%= staging.url %>"',
    '"http://<%= dev.url %>"',
    '--path="<%= dev.public_html %>"'
  ].join(' '))(templateVars);

  return ssh.exec(command, { filePath: 'wp-cli.log' })
    .pipe(gulp.dest('logs/'));
});
