/**
 * <%= themeName %>
 * Main JavaScript
 */

/* jshint esnext: true, node: true, browser: true */

'use strict';

import ie from './lib/ie-detect';
import config from './lib/config';
import $ from 'jquery';
import fastClick from 'fastclick';
import Logger from './lib/logger';
import matchMedia from './lib/match-media-polyfill';
import features from './lib/feature-detection';

var logger = Logger.getInstance();

$(function() {
  
  logger.log('timing', 'begin docReady');

  $(document.documentElement).removeClass('no-js').addClass('js');

  logger.log('timing', 'end docReady');

});
