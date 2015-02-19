/**
 * <%= themeName %>
 * Main JavaScript
 */

(function(window, undefined) {

  'use strict';

  var ie         = require('./lib/ie-detect');
  var config     = require('./lib/config');
  var $          = require('jquery');
  var fastClick  = require('fastclick');
  var logger     = require('./lib/logger');
  var matchMedia = require('./lib/match-media-polyfill');
  var features   = require('./lib/feature-detection');

  $(function() {
    
    logger.log('timing', 'begin docReady');

    $(document.documentElement).removeClass('no-js').addClass('js');

    logger.log('timing', 'end docReady');

  });

})(window);
