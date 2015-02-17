/**
 * Gulp Configuration
 */

/* jshint node: true */

'use strict';

var path  = require('path');
var gutil = require('gulp-util');
var src   = './source';
var build = './build';

var production = !gutil.env.dev;

module.exports = {
  src: src,
  build: build,
  production: production,
  resources: {
    scss: path.join(src, 'css', '**', '*.scss'),
    images: path.join(src, 'img', '**', '*.{png,jpg,jpeg,gif,svg}'),
    vendorImages: [],
    svg: path.join(src, 'img', '**', '*.svg'),
    php: path.join(src, '**', '*.php'),
    fonts: path.join(src, '**', '*.{eot,ttf,woff}'),
    vendorFonts: [
      path.join('node_modules', 'font-awesome', 'fonts', '*')
    ],
    json: {
      theme: 'theme.json',
      package: 'package.json',
      composer: 'composer.json'
    },
    misc: [
      path.join(src, '*'),
      '!source/*.php',
      './theme.json'
    ]
  },
  gzip: {
    gzipOptions: {
      level: 9
    }
  },
  browserify: {
    debug: !production
  },
  sass: {
    style: production ? 'compressed' : 'expanded',
    lineNumbers: !production,
    debugInfo: !production,
    precision: 10,
    loadPath: [
      path.join(__dirname, '..', 'source', 'css'),
      path.join(__dirname, '..', 'node_modules')
    ]
  },
  pleeease: {
    browsers: [ 'last 3 versions' ],
    minifier: production ? { preserveHacks: true, removeAllComments: true } : false,
    sourcemaps: false
  }
};
