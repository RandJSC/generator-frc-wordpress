<?php
/**
 * <%= themeName %>
 * Stylesheet Dependencies
 */

function <%= functionPrefix %>_enqueue_styles() {

  $theme_uri = get_stylesheet_directory_uri();
  $styles    = array(
    '<%= functionPrefix %>-main' => array(
      'src'     => "$theme_uri/css/style.css",
      'deps'    => array(),
      'version' => '0.1.0',
      'media'   => 'screen',
    ),
  );

  foreach ($styles as $slug => $info) {
    wp_register_style($slug, $info['src'], $info['deps'], $info['version'], $info['media']);
  }

  wp_enqueue_style('<%= functionPrefix %>-main');
}
add_action('wp_enqueue_scripts', '<%= functionPrefix %>_enqueue_styles');
