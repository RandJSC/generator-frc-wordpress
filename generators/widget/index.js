/**
 * FRC WordPress Generator
 * Widget Generator
 */

/* jshint node: true */

var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var chalk      = require('chalk');

module.exports = generators.Base.extend({

  description: 'Create a new Piklist-powered widget',

  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Piklist Widget'));

    if (!fs.existsSync(this.destinationPath('source/piklist/parts/widgets'))) {
      this.log(chalk.bold(chalk.red('Missing Piklist widgets folder!')));
      process.exit(1);
    }
  },

  prompting: function() {
    var self = this;
    var done = this.async();
    var questions = [

    ];

    this.prompt(questions, function(answers) {
      self.log(chalk.green('Got it. One widget, coming right up...'));
      self.answers = answers;
      done();
    });
  },

  writing: {
    addFrontendCode: function() {

    },

    addBackendCode: function() {

    }
  }

});
