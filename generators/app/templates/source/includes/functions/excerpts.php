<?php
/**
 * <%= themeName %>
 * Custom Excerpt Length
 */

function <%= functionPrefix %>_excerpt_length($length) {
  return 15;
}
//add_filter('excerpt_length', '<%= functionPrefix %>_excerpt_length');

function <%= functionPrefix %>_excerpt_more($more) {
  return '&hellip;';
}
//add_filter('excerpt_more', '<%= functionPrefix %>_excerpt_more');
