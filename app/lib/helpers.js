/**
 * FRC WordPress Generator
 * Helper Functions
 */

/* jshint node: true */

'use strict';

var _      = require('lodash');
var url    = require('url');
var semver = require('semver');

module.exports = {
  versionValidator: function(version) {
    if (!semver.valid(version)) {
      return 'Invalid version!';
    }

    return true;
  },

  characterValidator: function(pattern, message) {
    return function(value) {
      if (_.isUndefined(message)) {
        message = 'Invalid input!';
      }

      if (pattern.test(value)) {
        return message;
      }

      return true;
    };
  },

  urlValidator: function(input) {
    var parsed = url.parse(input);

    if (!parsed.hostname) {
      return 'Invalid URL!';
    }

    return true;
  },

  configureAuth: function(answers) {
    return answers.configureAuth;
  }
};
