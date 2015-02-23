
// Shortcode: <%= name %>
function <%= functionPrefix %>_shortcode_<%= name %>($atts = array(), $content = null) {
  extract(shortcode_atts(array(
<% _.forEach(args, function(arg) { %>    '<%= arg.name %>' => <%= ( arg.value ? arg.value : 'null' ) %>,<%= '\n' %><% }) %>
  ), $atts));

  <% if (doShortcode) { %>
    $content = do_shortcode($content);
  <% } %>

  ob_start();
?>

  <?php // SHORTCODE CONTENT HERE ?>

<?php
  return ob_get_clean();
}
