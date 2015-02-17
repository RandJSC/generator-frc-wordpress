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
var iniparser  = require('iniparser');
var helpers    = require('./lib/helpers');
var pkg        = require(path.join(__dirname, '..', 'package.json'));

var COMPOSER_URL = 'https://getcomposer.org/composer.phar';

var devDependencies = [
  'browserify',
  'browserify-shim',
  'chalk',
  'del',
  'exorcist',
  'glob',
  'gulp',
  'gulp-browserify',
  'gulp-bump',
  'gulp-cache',
  'gulp-changed',
  'gulp-concat',
  'gulp-filter',
  'gulp-gzip',
  'gulp-helptext',
  'gulp-if',
  'gulp-imagemin',
  'gulp-insert',
  'gulp-jshint',
  'gulp-load-plugins',
  'gulp-pleeease',
  'gulp-print',
  'gulp-rename',
  'gulp-ruby-sass',
  'gulp-shell',
  'gulp-size',
  'gulp-sourcemaps',
  'gulp-uglifyjs',
  'gulp-util',
  'gulp-zip',
  'handlebars',
  'imagemin-pngcrush',
  'jshint-stylish',
  'lazypipe',
  'lodash',
  'lodash.some',
  'map-stream',
  'node-notifier',
  'opn',
  'psi',
  'require-dir',
  'run-sequence',
  'semver',
  'vinyl-transform'
];

var productionDependencies = [
  'bragi-browser',
  'fastclick',
  'font-awesome',
  'hammerjs',
  'handlebars',
  'imagesloaded',
  'jquery',
  'lodash',
  'q',
  'spin.js',
  'slick-carousel'
];

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
          default: 'WordPress Theme',
          store: true
        },
        {
          type: 'input',
          name: 'slug',
          message: 'Please enter a slug for the theme:',
          default: function(answers) {
            return self._.slugify(answers.themeName);
          },
          validate: helpers.characterValidator(/[^0-9a-zA-Z\-\_]/, 'Alphanumeric characters, dashes, and underscores only!'),
          store: true
        },
        {
          type: 'input',
          name: 'themeDescription',
          message: 'Please enter a short description for the theme:',
          store: true
        },
        {
          type: 'input',
          name: 'authors',
          message: 'Who are the authors?',
          store: true
        },
        {
          type: 'input',
          name: 'functionPrefix',
          message: 'Please enter a short prefix for classes and function names:',
          default: 'frc',
          validate: helpers.characterValidator(/[^a-z\_]/, 'Lowercase letters and underscores only!'),
          store: true
        },
        {
          type: 'confirm',
          name: 'initRepo',
          message: 'Initialize a Git repo here?',
          default: true,
          store: true
        },
        {
          type: 'input',
          name: 'repoUrl',
          message: 'What is the theme\'s Git repo URL?',
          default: function() {
            var gitConfig = self.destinationPath('.git/config');

            if (!fs.existsSync(gitConfig)) {
              return null;
            }

            var config    = iniparser.parseSync(gitConfig);
            var hasRemote = config.hasOwnProperty('remote "origin"');

            if (hasRemote) {
              return config['remote "origin"'].url;
            }

            return null;
          },
          when: function(answers) { return answers.initRepo; },
          store: true
        },
        {
          type: 'input',
          name: 'devUrl',
          message: 'What is the local development URL?',
          default: 'http://localhost:8888',
          store: true
        },
        {
          type: 'input',
          name: 'stagingUrl',
          message: 'What is the staging URL?',
          validate: helpers.urlValidator,
          store: true
        },
        {
          type: 'input',
          name: 'rubyVersion',
          message: 'Which version of Ruby should we use?',
          default: '2.2.0',
          validate: helpers.versionValidator,
          store: true
        },
        {
          type: 'input',
          name: 'nodeVersion',
          message: 'Which Node version should we use?',
          default: '0.12.0',
          validate: helpers.versionValidator,
          store: true
        },
        {
          type: 'confirm',
          name: 'composer',
          message: 'Install the Composer PHP package manager?',
          default: false,
          store: true
        },
        {
          type: 'confirm',
          name: 'vagrant',
          message: 'Create & configure a Vagrant instance?',
          default: true,
          store: true
        },
        {
          type: 'confirm',
          name: 'vagrantUp',
          message: 'Start the Vagrant instance when we\'re done here?',
          default: true,
          when: function(answers) {
            return answers.vagrant;
          },
          store: true
        },
        {
          type: 'confirm',
          name: 'configureAuth',
          message: 'Configure authentication info?',
          default: true,
          store: true
        },
        {
          type: 'input',
          name: 'sshHost',
          message: 'SSH/SFTP hostname:',
          default: function(answers) {
            return url.parse(answers.stagingUrl).hostname;
          },
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'input',
          name: 'sshPort',
          message: 'SSH port:',
          default: 22,
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'input',
          name: 'sshUser',
          message: 'SSH user:',
          default: 'frcweb',
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'input',
          name: 'sshPath',
          message: 'Remote site root path:',
          default: function(answers) {
            var staging = url.parse(answers.stagingUrl);
            return path.join('public_html', staging.hostname, 'public');
          },
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'input',
          name: 'mysqlDB',
          message: 'Staging MySQL database:',
          default: function(answers) {
            return answers.slug.replace('-', '_');
          },
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'input',
          name: 'mysqlUser',
          message: 'Staging MySQL user:',
          default: 'wordpress_dev',
          when: helpers.configureAuth,
          store: true
        },
        {
          type: 'password',
          name: 'mysqlPassword',
          message: 'Staging MySQL password:',
          when: helpers.configureAuth,
          store: true
        }
      ];

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
    initGitRepo: function() {
      var self   = this;
      var config = this.config.getAll();

      if (!config.initRepo) {
        return;
      }

      this.log(chalk.magenta('Initializing Git repo'));

      var done = this.async();
      var git  = this.spawnCommand('git', [ 'init' ]);

      git.on('close', function(code) {
        self.log(chalk.green('Done'));

        self.fs.copy(
          self.templatePath('_.gitignore'),
          self.destinationPath('.gitignore')
        );

        if (config.repoUrl) {
          self.log(chalk.magenta('Setting remote repo URL'));

          var remote = self.spawnCommand('git', [ 'remote', 'add', 'origin', config.repoUrl ]);

          remote.on('close', function(code) {
            self.log(chalk.green('Done'));
            done();
          });
        } else {
          done();
        }
      });
    },

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
              hostname: staging.hostname,
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

    addPackageJSON: function() {
      var config = this.config.getAll();
      var pkg    = {
        name: config.slug,
        version: '0.1.0',
        description: config.themeDescription,
        private: true,
        devDependencies: {},
        dependencies: {}
      };

      if (config.repoUrl) {
        pkg.repository = {
          type: 'git',
          url: config.repoUrl
        };
      }

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
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

    copyProvisioning: function() {
      this.fs.copy(
        this.templatePath('provision/**/*'),
        this.destinationPath('provision/')
      );
    },

    copyVagrantfile: function() {
      this.fs.copyTpl(
        this.templatePath('_Vagrantfile'),
        this.destinationPath('Vagrantfile'),
        { slug: this.config.get('slug') }
      );
    },

    copyGemfile: function() {
      this.fs.copy(
        this.templatePath('_Gemfile'),
        this.destinationPath('Gemfile')
      );
    },

    copySource: function() {
      var self   = this;
      var config = this.config.getAll();

      this.fs.copy(
        this.templatePath('source/**/*'),
        this.destinationPath('source/'),
        {
          process: function(contents) {
            var template = _.template(contents.toString());
            return template(config);
          }
        }
      );
    },

    copyBuildSystem: function() {
      var config = this.config.getAll();

      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        config
      );

      this.fs.copy(
        this.templatePath('gulp/**/*'),
        this.destinationPath('gulp/')
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
    },

    npmDev: function() {
      this.log(chalk.magenta('Installing development packages'));

      this.npmInstall(devDependencies, { saveDev: true });
    },

    npmProduction: function() {
      this.log(chalk.magenta('Installing production packages'));

      this.npmInstall(productionDependencies, { save: true });
    },

    bundleInstall: function() {
      var self   = this;
      var done   = this.async();
      var bundle = this.spawnCommand('bundle', [ 'install' ]);

      this.log(chalk.magenta('Installing Ruby dependencies...'));

      bundle.on('close', function() {
        self.log(chalk.green('Done'));
        done();
      });
    }

  },

  end: {

    runGulp: function() {
      this.log(chalk.magenta('Running Gulp for the first time...'));

      var self = this;
      var done = this.async();
      var gulp = this.spawnCommand('gulp', [ 'default' ]);

      gulp.on('close', function(code) {
        self.log(chalk.green('Done'));
        done();
      });
    },

    vagrantUp: function() {
      var vagrantfile = this.destinationPath('Vagrantfile');
      var spinUp      = fs.existsSync(vagrantfile) && this.config.get('vagrantUp');

      if (!spinUp) {
        return;
      }

      this.log(chalk.magenta('Spinning up Vagrant instance...'));

      var self    = this;
      var done    = this.async();
      var vagrant = this.spawnCommand('vagrant', [ 'up' ]);

      vagrant.on('close', function(code) {
        self.log(chalk.green('Done'));
        done();
      });
    },

    goodbye: function() {
      this.log(chalk.bold(chalk.green('Your theme is ready. Go write some code!')));
      this.log(yosay('Thanks for using the FRC theme generator!'));
    }

  }

});
