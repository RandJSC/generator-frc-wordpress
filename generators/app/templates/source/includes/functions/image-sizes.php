<?php
/**
 * <%= themeName %>
 * Custom Image Sizes
 */

function <%= functionPrefix %>_image_sizes() {
  add_theme_support('post-thumbnails');

  // [ todo ] - Define custom image sizes here

  // set_post_thumbnail_size($width, $height, $crop);
  // add_image_size($name, $width, $height, $crop);
}
add_action('after_setup_theme', '<%= functionPrefix %>_image_sizes');
