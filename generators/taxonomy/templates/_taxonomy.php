
function <%= functionPrefix %>_register_taxonomy_<%= name %>($taxonomies) {
  $taxonomies[] = array(
    'name'      => '<%= name %>',
    'post_type' => array(
<% _.forEach(postTypes, function(pt) { %>      '<%= pt %>',<%= '\n' %><% }) %>
    ),
    'show_admin_column' => <%= showUI %>,
    'configuration'     => array(
      'hierarchical' => <%= hierarchical %>,
      'labels'       => piklist('taxonomy_labels', '<%= humanName %>'),
      'show_ui'      => <%= showUI %>,
      'query_var'    => <%= queryVar %>,
      'rewrite'      => array(
        'slug' => '<%= rewriteSlug %>',
      ),
    ),
  );

  return $taxonomies;
}
add_filter('piklist_taxonomies', '<%= functionPrefix %>_register_taxonomy_<%= name %>');
