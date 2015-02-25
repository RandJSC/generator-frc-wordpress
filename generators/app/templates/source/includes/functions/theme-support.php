<?php
/**
 * <%= themeName %>
 * Misc Theme Support Declarations
 */

function <%= functionPrefix %>_misc_theme_support() {
  add_theme_support('html5', array( 'search-form' ));
}
add_action('after_setup_theme', '<%= functionPrefix %>_misc_theme_support');
