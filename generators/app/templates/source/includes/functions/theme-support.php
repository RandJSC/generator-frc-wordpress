<?php
/**
 * <%= themeName %>
 * Misc Theme Support Declarations
 */

function <%= functionPrefix %>_misc_theme_support() {
  add_theme_support('html5', array( 'search-form' ));
}
add_action('init', '<%= functionPrefix %>_misc_theme_support');
