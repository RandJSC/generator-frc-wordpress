/**
 * Gulp Build Helpers
 */

/* jshint node: true */
/* jshint -W041 */

'use strict';

var _               = require('lodash');
var fs              = require('fs');
var gulp            = require('gulp');
var util            = require('gulp-util');
var shell           = require('gulp-shell');
var chalk           = require('chalk');
var notifier        = require('node-notifier');
var mapStream       = require('map-stream');
var Handlebars      = require('handlebars');
var path            = require('path');
var os              = require('os');
var spawnSync       = require('child_process').spawnSync;
var secrets         = require(path.join(__dirname, '..', '..', 'secrets.json'));
var dev             = secrets.servers.dev;
var staging         = secrets.servers.staging;
var defaultBindings = { dev: dev, staging: staging };

var vagrantDir = path.join(
  __dirname,
  '..',
  '..',
  '.vagrant',
  'machines',
  'default',
  'virtualbox'
);

var privateKey = path.join(
  vagrantDir,
  'private_key'
);

var idFile = path.join(
  vagrantDir,
  'id'
);

var scpTemplate = [
  'scp',
  '-P 2222',
  '-o IdentityFile=<%= privateKey %>',
  '-o StrictHostKeyChecking=no',
  '-o UserKnownHostsFile=/dev/null',
  '-o PasswordAuthentication=no',
  '-o IdentitiesOnly=yes',
  '-o LogLevel=FATAL'
];

var helpers  = {};

helpers.handleError = function (err) {
  notifier.notify({
    title: 'Gulp Error',
    message: err.message
  });
};

helpers.shell = function(command, bindings, shellOpts) {
  if (!_.isObject(bindings)) {
    bindings = {};
  }

  if (!_.isObject(shellOpts)) {
    shellOpts = {};
  }

  if (_.isArray(command)) {
    command = command.join(' ');
  }

  bindings  = _.assign({ dev: dev, staging: staging }, bindings);
  shellOpts = _.assign({ templateData: bindings }, shellOpts);

  return shell(command, shellOpts);
};

helpers.remoteShell = function(command, shellOpts) {
  if (!_.isString(command)) {
    command = '';
  }

  if (!_.isObject(shellOpts)) {
    shellOpts = {};
  }

  if (_.isArray(command)) {
    command = command.join(' ');
  }

  command      = _.template(command)(defaultBindings);
  var bindings = { command: command };
  var sshCmd   = [
    'ssh',
    '-p',
    '<%= staging.ssh.port %>',
    '<%= staging.ssh.username %>@<%= staging.ssh.hostname %>',
    "'<%= command %>'"
  ].join(' ');

  return helpers.shell(sshCmd, bindings, shellOpts);
};

helpers.vagrantCommand = function(command, shellOpts) {
  if (!_.isString(command)) {
    command = '';
  }

  if (!_.isObject(shellOpts)) {
    shellOpts = {};
  }

  if (_.isArray(command)) {
    command = command.join(' ');
  }

  command        = _.template(command)(defaultBindings);
  var bindings   = { command: command };
  var vagrantCmd = [
    'vagrant',
    'ssh',
    '--command',
    "'<%= command %>'"
  ].join(' ');

  return helpers.shell(vagrantCmd, bindings, shellOpts);
};

helpers.copyFromVagrant = function(file, dest, shellOpts) {
  if (!_.isObject(shellOpts)) {
    shellOpts = {};
  }

  var bindings = {
    file: file,
    dest: dest,
    privateKey: privateKey
  };

  var cmd = _.clone(scpTemplate);
  cmd.push("'vagrant@127.0.0.1:<%= file %>'");
  cmd.push("'<%= dest %>'");
  cmd = cmd.join(' ');

  return helpers.shell(cmd, bindings, shellOpts);
};

helpers.copyToVagrant = function(file, dest, shellOpts) {
  if (!_.isObject(shellOpts)) {
    shellOpts = {};
  }

  var bindings = {
    file: file,
    dest: dest,
    privateKey: privateKey
  };

  var cmd = _.clone(scpTemplate);
  cmd.push("'<%= file %>'");
  cmd.push("'vagrant@127.0.0.1:<%= dest %>'");
  cmd = cmd.join(' ');

  return helpers.shell(cmd, bindings, shellOpts);
};

helpers.isVagrant = function() {
  return process.env.USER === 'vagrant';
};

helpers.isOSX = function() {
  return os.platform() === 'darwin';
};

helpers.log = function(msg, once) {
  if (once == null) {
    once = true;
  }

  var times = 0;

  return mapStream(function(file, cb) {
    if (!once || (once && times < 1)) {
      util.log(msg);
    }

    times++;
    cb(null, file);
  });
};

helpers.vagrantRunning = function() {
  if (!fs.existsSync(idFile)) {
    return false;
  }

  var machineID = fs.readFileSync(idFile).toString();
  var result    = spawnSync('vboxmanage', [ 'list', 'runningvms' ]).stdout.toString();

  return result.indexOf(machineID) !== -1;
};

module.exports = helpers;
