<?php
/**
 * <%= themeName %>
 * Theme Options Page Definitions
 */

function <%= functionPrefix %>_register_settings_pages($pages) {

  $pages[] = array(
    'page_title'  => '<%= themeName %> Theme Options',
    'menu_title'  => 'Theme Options',
    'capability'  => 'manage_options',
    'menu_slug'   => '<%= functionPrefix %>_settings',
    'setting'     => '<%= functionPrefix %>_opts',
    'menu_icon'   => 'dashicons-admin-generic',
    'page_icon'   => 'dashicons-admin-generic',
    'single_line' => true,
    'default_tab' => 'General',
    'save_text'   => 'Save Theme Options',
  );

  return $pages;
}
add_filter('piklist_admin_pages', '<%= functionPrefix %>_register_settings_pages');
