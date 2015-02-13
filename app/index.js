/**
 * FRC WordPress Generator
 * Main Generator Class
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('fs');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var request    = require('request');
var chalk      = require('chalk');
var path       = require('path');
var semver     = require('semver');
var url        = require('url');
var helpers    = require('./lib/helpers');
var pkg        = require(path.join(__dirname, '..', 'package.json'));

var COMPOSER_URL = 'https://getcomposer.org/composer.phar';

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

      var config  = this.config.getAll();
      var dev     = url.parse(config.devUrl);
      var staging = url.parse(config.stagingUrl);
      var secrets = {
        theme: {
          name: config.themeName,
          slug: config.slug
        },
        servers: {
          staging: {
            url: staging.hostname,
            rsync: {
              hostname: staging.hostname,
              username: config.sshUser,
              path: path.join(config.sshPath, 'wp-content', 'themes', config.slug),
              port: config.sshPort,
              public_html: config.sshPath
            },
            ssh: {
              host: staging.hostname,
              username: config.sshUser,
              port: config.sshPort
            },
            mysql: {
              username: config.mysqlUser,
              password: config.mysqlPassword,
              database: config.mysqlDB
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

      this.fs.writeJSON(this.destinationPath('secrets.json'), secrets);
    },

    rvmConfig: function() {
      this.fs.copyTpl(
        this.templatePath('_.versions.conf'),
        this.destinationPath('.versions.conf'),
        { version: this.config.get('rubyVersion'), gemset: this.config.get('slug') }
      );
    },

    nvmConfig: function() {
      this.fs.copyTpl(
        this.templatePath('_.nvmrc'),
        this.destinationPath('.nvmrc'),
        { version: this.config.get('nodeVersion') }
      );
    },

    downloadComposer: function() {
      if (!this.config.get('composer')) {
        return;
      }

      this.log(chalk.green('Downloading Composer...'));

      var self = this;
      var done = this.async();

      request(COMPOSER_URL, function(err, resp, body) {
        self.log(chalk.green('Composer downloaded!'));
        self.fs.write(self.destinationPath('composer.phar'), body);
        done();
      });
    },

    copyPHP: function() {
      var self = this;

      this.fs.copy(
        this.templatePath('source/**/*.php'),
        this.destinationPath('source/'),
        {
          process: function(contents) {
            var template = _.template(contents.toString());
            return template(self.config.getAll());
          }
        }
      );
    }
  },

  install: {
    chmodComposer: function() {
      var self     = this;
      var done     = this.async();
      var composer = this.destinationPath('composer.phar');

      fs.exists(composer, function(exists) {
        if (exists) {
          self.log(chalk.yellow('Making Composer executable'));
          fs.chmod(composer, '755', function() {
            done();
          });
        }
      });
    }
  }

});
