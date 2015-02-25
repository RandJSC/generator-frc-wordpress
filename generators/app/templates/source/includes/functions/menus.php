<?php
/**
 * <%= themeName %>
 * Navigation Menus
 */

function <%= functionPrefix %>_register_nav_menus() {
  if (!function_exists('register_nav_menus')) return;

  register_nav_menus(array(
    'main_nav' => 'Main Navigation',
  ));
}
add_action('after_setup_theme', '<%= functionPrefix %>_register_nav_menus');
