/**
 * FRC WordPress Generator
 * Piklist Metabox Generator
 */

/* jshint node: true */

var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');
var generators = require('yeoman-generator');
var yosay      = require('yosay');
var chalk      = require('chalk');

module.exports = generators.Base.extend({
  description: 'Create a new Piklist metabox for a post type',

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('name', { type: String, required: true });

    if (!fs.existsSync(this.destinationPath('source/piklist/parts/meta-boxes'))) {
      this.log(chalk.bold(chalk.red('Missing Piklist metaboxes folder!')));
      process.exit(1);
    }
  },

  initializing: function() {
    this.log(yosay('FRC WordPress Generator: Piklist Metabox'));
    this.name = this._.str.dasherize(this.name);
  },

  prompting: function() {
    var self      = this;
    var done      = this.async();
    var str       = this._.str;
    var questions = [
      {
        type: 'input',
        name: 'title',
        message: 'Human-friendly title for this metabox:',
        default: function() {
          return str.titleize(
            str.humanize(self.name)
          );
        }
      },
      {
        type: 'input',
        name: 'postTypes',
        message: 'Show this metabox on the following post types in admin (separate multiple names with commas):\n',
        default: 'post',
        filter: function(input) {
          var types = input.split(',');
          return _.map(types, function(type) { return str.strip(type); });
        }
      },
      {
        type: 'list',
        name: 'context',
        message: 'Context (where to render the metabox):',
        choices: [
          {
            name: 'Main content area',
            value: 'normal'
          },
          {
            name: 'Sidebar',
            value: 'side'
          }
        ]
      },
      {
        type: 'input',
        name: 'priority',
        message: 'Display priority:',
        default: 'high'
      }
    ];

    this.prompt(questions, function(answers) {
      self.log(chalk.green('Got it. One metabox, coming right up...'));
      self.answers = answers;
      done();
    });
  },

  writing: function() {
    var tplFile = this.fs.read(
      this.templatePath('_metabox.php')
    );
    var template = _.template(tplFile);
    var binding  = _.assign(savedConfig, this.answers, {
      name: this.name,
      _: _
    });
    var destFile = this.destinationPath('source/piklist/parts/meta-boxes/' + this.name + '.php');

    this.fs.write(destFile, template(binding));
  }

});
