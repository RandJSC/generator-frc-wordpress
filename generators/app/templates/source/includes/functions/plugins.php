<?php
/**
 * <%= themeName %>
 * WordPress Plugin Dependencies
 */

require_once trailingslashit(dirname(__FILE__)) . '../class-tgm-plugin-activation.php';

function <%= functionPrefix %>_register_plugins() {

  $plugins = array(
    array(
      'name'     => 'PIKLIST | Rapid development framework',
      'slug'     => 'piklist',
      'required' => true,
    ),
    array(
      'name'     => 'JSON REST API (WP API)',
      'slug'     => 'json-rest-api',
      'required' => true,
    ),
    array(
      'name'     => 'WordPress SEO by Yoast',
      'slug'     => 'wordpress-seo',
      'required' => true,
    ),
    array(
      'name'     => 'Google Analytics by Yoast',
      'slug'     => 'google-analytics-for-wordpress',
      'required' => true,
    ),
    array(
      'name'     => 'Debug Bar',
      'slug'     => 'debug-bar',
      'required' => false,
    ),
    array(
      'name'     => 'Regenerate Thumbnails',
      'slug'     => 'regenerate-thumbnails',
      'required' => false,
    ),
    array(
      'name'     => 'Asset Queue Manager',
      'slug'     => 'asset-queue-manager',
      'required' => false,
    ),
  );

  $config = array(
    'is_automatic' => true,
  );

  tgmpa($plugins, $config);
}
add_action('tgmpa_register', '<%= functionPrefix %>_register_plugins');
