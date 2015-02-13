/**
 * FRC WordPress Generator
 * Main Generator Class
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var request    = require('request');
var chalk      = require('chalk');
var path       = require('path');
var semver     = require('semver');
var url        = require('url');
var pkg        = require(path.join(__dirname, '..', 'package.json'));

var helpers    = {
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

module.exports = generators.Base.extend({

  description: pkg.description,

  defaults: {},

  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  initializing: {
    setPkg: function() {
      this.pkg = pkg;
    },

    welcome: function() {
      this.log(yosay('Welcome to the FRC WordPress generator!'));
    }
  },

  prompting: {
    showPrompts: function() {
      var self      = this;
      var done      = this.async();

      var questions = [
        {
          type: 'input',
          name: 'themeName',
          message: 'What is the theme\'s name?',
          default: 'WordPress Theme'
        },
        {
          type: 'input',
          name: 'slug',
          message: 'Please enter a slug for the theme:',
          default: function(answers) {
            return self._.slugify(answers.themeName);
          },
          validate: helpers.characterValidator(/[^0-9a-zA-Z\-\_]/, 'Alphanumeric characters, dashes, and underscores only!')
        },
        {
          type: 'input',
          name: 'themeDescription',
          message: 'Please enter a short description for the theme:'
        },
        {
          type: 'input',
          name: 'authors',
          message: 'Who are the authors?'
        },
        {
          type: 'input',
          name: 'functionPrefix',
          message: 'Please enter a short prefix for classes and function names:',
          default: 'frc',
          validate: helpers.characterValidator(/[^a-z\_]/, 'Lowercase letters and underscores only!')
        },
        {
          type: 'input',
          name: 'devUrl',
          message: 'What is the local development URL?',
          default: 'http://localhost:8888'
        },
        {
          type: 'input',
          name: 'stagingUrl',
          message: 'What is the staging URL?',
          validate: helpers.urlValidator
        },
        {
          type: 'input',
          name: 'rubyVersion',
          message: 'Which version of Ruby should we use?',
          default: '2.2.0',
          validate: helpers.versionValidator
        },
        {
          type: 'input',
          name: 'nodeVersion',
          message: 'Which Node version should we use?',
          default: '0.12.0',
          validate: helpers.versionValidator
        },
        {
          type: 'confirm',
          name: 'composer',
          message: 'Install the Composer PHP package manager?',
          default: false
        },
        {
          type: 'confirm',
          name: 'configureAuth',
          message: 'Configure authentication info?',
          default: true
        },
        {
          type: 'input',
          name: 'sshHost',
          message: 'SSH/SFTP hostname:',
          default: function(answers) {
            return url.parse(answers.stagingUrl).hostname;
          },
          when: helpers.configureAuth
        },
        {
          type: 'input',
          name: 'sshPort',
          message: 'SSH port:',
          default: 22,
          when: helpers.configureAuth
        },
        {
          type: 'input',
          name: 'sshUser',
          message: 'SSH user:',
          default: 'frcweb',
          when: helpers.configureAuth
        },
        {
          type: 'input',
          name: 'sshPath',
          message: 'Remote site root path:',
          default: function(answers) {
            var staging = url.parse(answers.stagingUrl);
            return path.join('public_html', staging.hostname, 'public');
          },
          when: helpers.configureAuth
        },
        {
          type: 'input',
          name: 'mysqlDB',
          message: 'Staging MySQL database:',
          default: function(answers) {
            return answers.slug.replace('-', '_');
          },
          when: helpers.configureAuth
        },
        {
          type: 'input',
          name: 'mysqlUser',
          message: 'Staging MySQL user:',
          default: 'wordpress_dev',
          when: helpers.configureAuth
        },
        {
          type: 'password',
          name: 'mysqlPassword',
          message: 'Staging MySQL password:',
          when: helpers.configureAuth
        }
      ];

      questions = _.map(questions, function(q) {
        q.store = true;
        return q;
      });

      this.prompt(questions, function(answers) {
        self.answers = _.assign(self.defaults, answers);
        done();
      });
    }
  },

  configuring: {
    saveYoRC: function() {
      var self = this;

      _.forEach(this.answers, function(value, key) {
        self.config.set(key, value);
      });
    }
  },

  writing: {
    addSecretsJSON: function() {
      if (!this.answers.configureAuth) {
        return;
      }

      var dev     = url.parse(this.answers.devUrl);
      var staging = url.parse(this.answers.stagingUrl);
      var config  = {
        theme: {
          name: this.answers.themeName,
          slug: this.answers.slug
        },
        servers: {
          staging: {
            url: staging.hostname,
            rsync: {
              hostname: staging.hostname,
              username: this.answers.sshUser,
              path: path.join(this.answers.sshPath, 'wp-content', 'themes', this.answers.slug),
              port: this.answers.sshPort,
              public_html: this.answers.sshPath
            },
            ssh: {
              host: staging.hostname,
              username: this.answers.sshUser,
              port: this.answers.sshPort
            },
            mysql: {
              username: this.answers.mysqlUser,
              password: this.answers.mysqlPassword,
              database: this.answers.mysqlDB
            }
          },
          dev: {
            url: dev.hostname + ':' + dev.port,
            public_html: '/home/vagrant/www',
            mysql: {
              username: 'root',
              password: 'root',
              database: 'wordpress_dev',
              host: '127.0.0.1',
              port: 8889
            },
            ssh: {
              port: 2222
            }
          }
        }
      };

      this.fs.writeJSON(this.destinationPath('secrets.json'), config);
    }
  }

});
