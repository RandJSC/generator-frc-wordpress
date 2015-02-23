/**
 * FRC WordPress Generator
 * Custom Taxonomy Generator
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var chalk      = require('chalk');

module.exports = generators.Base.extend({

  description: 'Create a new custom taxonomy',

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('name', { type: String, required: true });

    if (!fs.existsSync(this.destinationPath('source/includes/functions/taxonomies.php'))) {
      this.log(chalk.red('Missing taxonomies.php include in destination!'));
      process.exit(1);
    }
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Custom Taxonomy'));
    this.name = this._.str.underscored(this.name);
  },

  prompting: function() {
    var self = this;
    var done = this.async();
    var str  = self._.str;
    var questions = [
      {
        type: 'input',
        name: 'humanName',
        message: 'Enter a human-friendly name for the taxonomy:',
        default: function() {
          return str.titleize(
            str.humanize(self.name)
          );
        }
      },
      {
        type: 'input',
        name: 'rewriteSlug',
        message: 'What should the taxonomy\'s permalink slug be?',
        default: function() {
          return str.dasherize(self.name);
        }
      },
      {
        type: 'input',
        name: 'postTypes',
        message: 'Which post types should the taxonomy apply to?\n(separate multiple post types with commas - ex. \'post,page\')',
        default: 'post',
        filter: function(input) {
          var types = input.split(',');
          return _.map(types, function(type) { return str.strip(type); });
        }
      },
      {
        type: 'confirm',
        name: 'hierarchical',
        message: 'Is the taxonomy hierarchical, like categories?',
        default: true
      },
      {
        type: 'confirm',
        name: 'showUI',
        message: 'Show user interface for managing this taxonomy in admin?',
        default: true
      },
      {
        type: 'confirm',
        name: 'queryVar',
        message: 'Create a query variable for this taxonomy?',
        default: true
      },
      {
        type: 'confirm',
        name: 'metabox',
        message: 'Create a metabox for adding custom fields?',
        default: true
      }
    ];

    this.prompt(questions, function(answers) {
      self.log(chalk.green('Got it. One custom taxonomy, coming up...'));
      self.answers = answers;
      done();
    });
  },

  writing: {
    registerTaxonomy: function() {
      var self        = this;
      var savedConfig = this.config.getAll();
      var destFile    = this.destinationPath('source/includes/functions/taxonomies.php');
      var content     = this.fs.read(destFile);
      var tplFile     = this.fs.read(
        this.templatePath('_taxonomy.php')
      );
      var template    = _.template(tplFile);
      var binding     = _.assign(savedConfig, this.answers, {
        name: this.name,
        _: _
      });

      content += template(binding);

      this.fs.write(destFile, content);
    },

    addMetabox: function() {
      if (!this.answers.metabox) {
        return;
      }

      var self        = this;
      var savedConfig = this.config.getAll();
      var destFile    = this.destinationPath('source/piklist/parts/terms/' + this.name + '-fields.php');
      var tplFile     = this.fs.read(
        this.templatePath('_metabox.php')
      );
      var template    = _.template(tplFile);
      var binding     = _.assign(savedConfig, this.answers, {
        name: this.name,
        _: _
      });

      this.fs.write(destFile, template(binding));
    }
  }
});
