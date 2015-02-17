<?php
global $theme_uri, $<%= functionPrefix %>_settings;
$theme_uri = get_stylesheet_directory_uri();
$<%= functionPrefix %>_settings = get_option('<%= functionPrefix %>_settings');
?>
<!--[if IE 8]> <html class="no-js lt-ie10 lt-ie9 ie" lang="en"> <![endif]-->
<!--[if IE 9]> <html class="no-js lt-ie10 ie" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<html lang="en">
<head>
	<meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title><?php wp_title(); ?></title>

  <?php if ($<%= functionPrefix %>_settings['favicon_ico']): ?>
    <?php
    $ico_src     = wp_get_attachment_image_src($<%= functionPrefix %>_settings['favicon_ico'], 'full');
    $favicon_ico = $ico_src[0];
    ?>
    <link rel="shortcut icon" href="<?php echo $favicon_ico; ?>">
  <?php endif; ?>

  <?php if ($<%= functionPrefix %>_settings['favicon_png']): ?>
    <?php
    $png_src     = wp_get_attachment_image_src($<%= functionPrefix %>_settings['favicon_png'], 'full');
    $favicon_png = $png_src[0];
    ?>
    <link rel="icon" href="<?php echo $favicon_png; ?>">
  <?php endif; ?>

  <?php if ($<%= functionPrefix %>_settings['apple_touch_icon']): ?>
    <?php
    $touch_icon = wp_get_attachment_image_src($<%= functionPrefix %>_settings['apple_touch_icon'], 'full');
    $touch_icon = $touch_icon[0];
    ?>
    <link rel="apple-touch-icon-precomposed" href="<?php echo $touch_icon; ?>">
    <meta name="msapplication-TileColor" content="#FFFFFF">
    <meta name="msapplication-TileImage" content="<?php echo $touch_icon; ?>">
  <?php endif; ?>

  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
