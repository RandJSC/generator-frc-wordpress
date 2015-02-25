/**
 * <%= themeName %>
 * Barebones Feature Detection Library
 */

/* jshint esnext: true, globalstrict: true */
/* global window */

'use strict';

import isUndefined from 'lodash.isundefined';
import memoize     from 'lodash.memoize';

export var touch = memoize(function() {
  return ('ontouchstart' in window || 'onmsgesturechange' in window);
});

export var matchMedia = memoize(function() {
  return ('matchMedia' in window && typeof window.matchMedia === 'function');
});

export var matchMediaListener = memoize(function() {
  if (!matchMedia()) {
    return false;
  }

  var matcher = window.matchMedia('only all');

  return ('addListener' in matcher && typeof matcher.addListener === 'function');
});
