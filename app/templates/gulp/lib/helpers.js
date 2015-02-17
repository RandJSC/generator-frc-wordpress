/**
 * <%= themeName %>
 * Gulp Build Helpers
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var gulp       = require('gulp');
var util       = require('gulp-util');
var shell      = require('gulp-shell');
var chalk      = require('chalk');
var notifier   = require('node-notifier');
var mapStream  = require('map-stream');
var Handlebars = require('handlebars');
var path       = require('path');
var os         = require('os');
var secrets    = require(path.join(__dirname, '..', 'secrets.json'));
var dev        = secrets.servers.dev;
var staging    = secrets.servers.staging;

var vagrantSSH = path.join(__dirname, '..', 'vagrant-ssh.config');

var helpers  = {};

helpers.handleError = function (err) {
  notifier.notify({
    title: 'Gulp Error',
    message: err.message
  });
};

helpers.shellTpl = function(command, bindings) {
  if (!_.isObject(bindings)) {
    bindings = {};
  }

  bindings = _.assign({ dev: dev, staging: staging }, bindings);

  return shell(command, {
    templateData: bindings
  });
};

helpers.remoteShell = function(command, bindings) {
  if (!_.isObject(bindings)) {
    bindings = {};
  }

  bindings = _.assign({ command: command }, bindings);

  var sshCmd = [
    'ssh',
    '-p',
    '<%= staging.ssh.port %>',
    '<%= staging.ssh.username %>@<%= staging.ssh.hostname %>',
    "'<%= command %>'"
  ].join(' ');

  return helpers.shellTpl(sshCmd, bindings);
};

helpers.vagrantCommand = function(command, bindings) {
  if (!_.isObject(bindings)) {
    bindings = {};
  }

  bindings = _.assign({ command: command }, bindings);

  var vagrantCmd = [
    'vagrant',
    'ssh',
    '--command',
    "'<%= command %>'"
  ].join(' ');

  return helpers.shellTpl(vagrantCmd, bindings);
};

module.exports = helpers;
