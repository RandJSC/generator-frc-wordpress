<?php
/**
 * <%= themeName %>
 * Master Functions File
 */

$theme_base = trailingslashit(dirname(__FILE__));
$includes   = trailingslashit($theme_base . 'includes');
$functions  = trailingslashit($includes . 'functions');

include $functions . 'utilities.php';
include $functions . 'image-sizes.php';
include $functions . 'login.php';
include $functions . 'menus.php';
include $functions . 'plugins.php';
include $functions . 'post-types.php';
include $functions . 'taxonomies.php';
include $functions . 'settings.php';
include $functions . 'shortcodes.php';
include $functions . 'styles.php';
include $functions . 'theme-support.php';
include $functions . 'widgets.php';
include $functions . 'excerpts.php';
