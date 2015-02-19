<?php
/**
 * <%= themeName %>
 * WordPress Login Logo Customization
 */

function <%= functionPrefix %>_login_logo() {
  $settings = get_option('<%= functionPrefix %>_opts');

  if (!<%= functionPrefix %>_theme_option_exists('admin_logo')) {
    return;
  }

  list($src, $width, $height, $scale) = wp_get_attachment_image_src($settings['admin_logo'], 'full');
?>
  <style type="text/css">
    body.login div#login h1 a {
      background-image: url('<?php echo $src; ?>');
      background-size: <?php echo $width; ?>px <?php echo $height; ?>px;
      background-repeat: no-repeat;
      width: <?php echo $width; ?>px;
      height: <?php echo $height; ?>px;
    }
  </style>
<?php
}
add_action('login_enqueue_scripts', '<%= functionPrefix %>_login_logo');
