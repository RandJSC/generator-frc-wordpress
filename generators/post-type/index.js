/**
 * FRC WordPress Generator
 * Custom Post Type Sub-generator
 */

/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('fs');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var chalk      = require('chalk');
var path       = require('path');
var inflect    = require('inflect');

module.exports = generators.Base.extend({

  visibilityChoices: [
    'public',
    'exclude_from_search',
    'publicly_queryable',
    'show_in_nav_menus',
    'show_ui',
    'show_in_menu',
    'show_in_admin_bar'
  ],

  description: 'Create a new custom post type',

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('name', { type: String, required: true });

    if (!fs.existsSync(this.destinationPath('source/includes/functions/post-types.php'))) {
      this.log(chalk.bold(chalk.red('Missing post-types.php include in destination!')));
      process.exit(1);
    }
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Custom Post Type'));
  },

  prompting: function() {
    var self = this;
    var done = this.async();

    var questions = [
      {
        type: 'input',
        name: 'pluralLabel',
        message: 'Plural label:',
        default: function() {
          return inflect.pluralize(inflect.titleize(self.name));
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:'
      },
      {
        type: 'checkbox',
        name: 'supports',
        message: 'Supported functionality:',
        choices: [
          'title',
          'editor',
          'author',
          'thumbnail',
          'excerpt',
          'trackbacks',
          'custom-fields',
          'comments',
          'revisions',
          'page-attributes',
          'post-formats'
        ],
        default: [ 'title', 'editor', 'thumbnail' ]
      },
      {
        type: 'checkbox',
        name: 'visibilityOpts',
        message: 'Visibility options:',
        choices: this.visibilityChoices,
        default: [
          'public',
          'publicly_queryable',
          'show_in_nav_menus',
          'show_ui',
          'show_in_menu'
        ]
      },
      {
        type: 'confirm',
        name: 'createMetabox',
        message: 'Create a Piklist metabox for this post type?',
        default: true
      }
    ];


    this.prompt(questions, function(answers) {
      self.answers = answers;
      done();
    });
  },

  writing: {
    registerPostType: function() {
      var self        = this;
      var savedConfig = this.config.getAll();
      var tplVars     = _.assign(savedConfig, this.answers, {
        name: this.name,
        underscoreName: this._.str.underscored(this.name)
      });

      tplVars.supports = _.map(tplVars.supports, function(item) {
        return '\'' + item + '\'';
      });

      _.forEach(this.visibilityChoices, function(choice) {
        tplVars[choice] = _.include(self.answers.visibilityOpts, choice);
      });

      var cptInclude  = this.destinationPath('source/includes/functions/post-types.php');
      var cptContent  = this.fs.read(cptInclude);
      var template    = _.template(
        this.fs.read(
          this.templatePath('_post-type.php')
        )
      );
      cptContent     += template(tplVars);

      this.log(chalk.magenta('Appending post type to ' + path.basename(cptInclude)));

      this.fs.write(cptInclude, cptContent);
    },

    addMetabox: function() {
      var metaboxFile = this.destinationPath('source/piklist/parts/meta-boxes/' + this.name + '-fields.php');
      var tplFile     = this.templatePath('_metabox.php');
      var tplVars     = _.assign(this.config.getAll(), this.answers, {
        name: this.name
      });

      this.fs.copyTpl(tplFile, metaboxFile, tplVars);
    }
  }
});
