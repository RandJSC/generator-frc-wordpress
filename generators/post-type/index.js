/**
 * FRC WordPress Generator
 * Custom Post Type Sub-generator
 */

/* jshint node: true */
/* global Set */

'use strict';

var _           = require('lodash');
var fs          = require('fs');
var generators  = require('yeoman-generator');
var yosay       = require('yosay');
var chalk       = require('chalk');
var path        = require('path');
var inflect     = require('inflect');
var collections = require('es6-collections');

var isPublic   = function isPublic(answers) {
  return !!_.find(answers.visibilityOpts, function(opt) {
    return opt === 'public' || opt === 'show_ui';
  });
};

module.exports = generators.Base.extend({

  _visibilityChoices: [
    'public',
    'exclude_from_search',
    'publicly_queryable',
    'show_in_nav_menus',
    'show_ui',
    'show_in_menu',
    'show_in_admin_bar'
  ],

  _supportChoices: [
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

  description: 'Create a new custom post type',

  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });
  },

  _supportDefaults: function(answers) {
    var supports = [ 'title' ];

    if (isPublic(answers)) {
      supports.push('editor');
      supports.push('thumbnail');
    }

    return supports;
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Custom Post Type'));

    if (!fs.existsSync(this.destinationPath('source/includes/functions/post-types.php'))) {
      this.log(chalk.bold(chalk.red('Missing post-types.php include in destination!')));
      process.exit(1);
    }
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
        name: 'visibilityOpts',
        message: 'Visibility options:',
        choices: this._visibilityChoices,
        default: [
          'public',
          'publicly_queryable',
          'show_in_nav_menus',
          'show_ui',
          'show_in_menu'
        ]
      },
      {
        type: 'checkbox',
        name: 'supports',
        message: 'Supported functionality:',
        choices: this._supportChoices,
        default: this._supportDefaults
      },
      {
        type: 'confirm',
        name: 'hasArchive',
        message: 'Should the post type have an archive?',
        default: isPublic
      },
      {
        type: 'confirm',
        name: 'createMetabox',
        message: 'Create a Piklist metabox for this post type?',
        default: isPublic
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

      tplVars.visibility = new Set(self.answers.visibilityOpts);

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
      if (!this.answers.createMetabox) {
        return;
      }

      var metaboxFile = this.destinationPath('source/piklist/parts/meta-boxes/' + this.name + '-fields.php');
      var tplFile     = this.templatePath('_metabox.php');
      var tplVars     = _.assign(this.config.getAll(), this.answers, {
        name: this.name
      });

      this.fs.copyTpl(tplFile, metaboxFile, tplVars);
    }
  }
});
