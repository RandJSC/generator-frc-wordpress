/**
 * <%= themeName %>
 * Debug Logger Compatibility Layer
 *
 * (fixes missing IE 9 window.console)
 */

/* jshint esnext: true, globalstrict: true, browser: true */
/* global console */

'use strict';

import ie from './ie-detect';
import assign from 'lodash.assign';
import Bragi from 'bragi-browser';

var Logger = (function() {
  var instance;
  var defaults = {
    disabled: false
  };

  var LoggerInstance = function(opts) {
    var noop     = function() {};

    this.options = assign(defaults, opts);
    this.backend = null;

    if (!ie.isIE()) {
      this.backend = Bragi;
    } else if ('console' in window) {
      // Allows us to call `window.console.apply(...)`
      window.console.log = Function.prototype.bind.call(console.log, console);
      this.backend       = window.console;
    } else {
      this.backend = noop;
    }
  };

  LoggerInstance.prototype.log = function log() {
    if (this.options.disabled) {
      return;
    }

    return this.backend.log.apply(this.backend, arguments);
  };

  return {
    getInstance: function getInstance(opts) {
      if (instance === undefined) {
        instance = new LoggerInstance(opts);
      }

      return instance;
    }
  };
})();

export default Logger;
