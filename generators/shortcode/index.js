/**
 * FRC WordPress Generator
 * Shortcode Generator
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var chalk      = require('chalk');
_.str          = require('underscore.string');

module.exports = generators.Base.extend({

  _nameValuePairs: function(answerString) {
    var rawPairs = answerString.split(',');
    var pairs    = _.map(rawPairs, function(arg) {
      var pair = { name: null, value: null };

      if (arg.indexOf('=') !== -1) {
        arg       = arg.split('=');
        pair.name = _.str.strip(arg[0]);

        if (arg.length < 2 || _.isEmpty(arg[1])) {
          return pair;
        }

        pair.value = _.str.strip(arg[1]);

        return pair;
      }

      pair.name = _.str.strip(arg);
      return pair;
    });

    return pairs;
  },

  description: 'Create a new shortcode for use in post content',

  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Shortcode'));
    this.name = _.str.underscored(this.name);

    if (!fs.existsSync(this.destinationPath('source/includes/functions/shortcodes.php'))) {
      this.log(chalk.red('Missing shortcodes.php include in destination!'));
      process.exit(1);
    }
  },

  prompting: function() {
    var self      = this;
    var done      = this.async();
    var questions = [
      {
        type: 'confirm',
        name: 'doShortcode',
        message: 'Execute shortcodes found inside of this one?',
        default: false
      },
      {
        type: 'input',
        name: 'args',
        message: 'Comma separated list of arguments that the shortcode should take\n(ex: arg1=\'default value here\',argname_2,argname_3)',
        filter: self._nameValuePairs,
        validate: function(input) {
          var valid = true;

          if (_.isEmpty(input)) {
            return valid;
          }

          var attrPairs = self._nameValuePairs(input);
          valid         = !!_.first(attrPairs, function(pair) {
            var attr         = { name: '', value: '' };
            var invalidChars = /[^a-zA-Z0-9\_]/g;

            if (_.isEmpty(pair.name) || invalidChars.test(pair.name)) {
              return true;
            }

            return false;
          });

          if (!valid) {
            return 'Invalid input. Ex: arg1=\'default value\',arg2=\'default value\',arg3';
          }

          return valid;
        }
      },
    ];

    this.prompt(questions, function(answers) {
      self.log(chalk.green('Got it. One shortcode, coming up...'));
      self.answers = answers;
      done();
    });
  },

  writing: function() {
    var config   = this.config.getAll();
    var binding  = _.assign(config, this.answers, { name: this.name });
    binding._    = _;
    var phpFile  = this.destinationPath('source/includes/functions/shortcodes.php');
    var fileData = this.fs.read(phpFile);
    var template = _.template(
      this.fs.read(
        this.templatePath('_shortcode.php')
      )
    );
    fileData    += template(binding);

    this.fs.write(phpFile, fileData);
  }

});
