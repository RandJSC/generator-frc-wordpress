/**
 * <%= themeName %>
 * Internet Explorer Detection Module
 */

/* jshint esnext: true, globalstrict: true, browser: true */

'use strict';

import some     from 'lodash.some';
import includes from 'lodash.includes';

var html         = document.documentElement;
var hasClassList = includes(html, 'classList');

var hasConditionalClass = function hasConditionalClass(klass) {
  if (hasClassList) {
    return html.classList.contains(klass);
  }

  var classes = html.className.split(' ');

  return some(classes, function(cls) {
    return cls === klass;
  });
};

var methods = {};
methods.isIE = function isIE(ver) {
  var hasClass = hasConditionalClass('ie');

  if (!hasClass) {
    return false;
  }

  if (ver) {
    return methods.lt(ver + 1) && methods.gt(ver - 1);
  }

  return true;
};

methods.lt = function(ver) {
  var verClass = 'lt-ie' + ver;
  return methods.isIE() && hasConditionalClass(verClass);
};

methods.lte = function(ver) {
  var verClass = 'lt-ie' + (ver + 1);
  return methods.isIE() && hasConditionalClass(verClass);
};

export default methods;
