/**
 * <%= themeName %>
 * Debug Logger Compatibility Layer
 *
 * (fixes missing IE 9 window.console)
 */

/* jshint esnext: true, globalstrict: true, browser: true */
/* global console */

'use strict';

import ie          from './ie-detect';
import assign      from 'lodash.assign';
import includes    from 'lodash.includes';
import isUndefined from 'lodash.isundefined';
import Bragi       from 'bragi-browser';

class LoggerInstance {
  constructor(opts = {}) {
    var noop     = function noop() {};
    var defaults = { disabled: false };

    this.options = assign(defaults, opts);
    this.backend = noop;

    if (!ie.isIE()) {
      this.backend = Bragi;
    } else if (includes(window, 'console')) {
      window.console.log = Function.prototype.bind.call(window.console.log, console);
      this.backend       = window.console;
    }
  }

  log() {
    if (this.options.disabled) {
      return;
    }

    return this.backend.log.apply(this.backend, arguments);
  }
}

var instance;

var Logger = {
  getInstance(opts = {}) {
    if (isUndefined(instance)) {
      instance = new LoggerInstance(opts);
    }

    return instance;
  }
};

export default Logger;
