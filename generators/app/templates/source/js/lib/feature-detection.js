/**
 * <%= themeName %>
 * Barebones Feature Detection Library
 */

(function(window, undefined) {

  'use strict';

  var touch = function() {
    return ('ontouchstart' in window || 'onmsgesturechange' in window);
  };

  var matchMedia = function() {
    return ('matchMedia' in window && typeof window.matchMedia === 'function');
  };

  var matchMediaListener = function() {
    if (!matchMedia()) {
      return false;
    }

    var matcher = window.matchMedia('only all');

    return ('addListener' in matcher && typeof matcher.addListener === 'function');
  };

  module.exports = {
    touch: touch(),
    matchMedia: matchMedia(),
    matchMediaListener: matchMediaListener()
  };

})(window);
