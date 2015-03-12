
function <%= functionPrefix %>_register_post_type_<%= underscoreName %>($post_types) {

  $labels         = piklist('post_type_labels', '<%= pluralLabel %>');
  $labels['name'] = '<%= pluralLabel %>';

  $post_types['<%= name %>'] = array(
    'labels'              => $labels,
    'title'               => 'Enter a Title...',
    'description'         => '<%= description %>',
    'supports'            => array( <%= supports.join(", ") %> ),
    'public'              => <%= visibility.has('public') %>,
    'exclude_from_search' => <%= visibility.has('exclude_from_search') %>,
    'publicly_queryable'  => <%= visibility.has('publicly_queryable') %>,
    'show_in_nav_menus'   => <%= visibility.has('show_in_nav_menus') %>,
    'show_ui'             => <%= visibility.has('show_ui') %>,
    'show_in_menu'        => <%= visibility.has('show_in_menu') %>,
    'show_in_admin_bar'   => <%= visibility.has('show_in_admin_bar') %>,
  );

  return $post_types;
}
add_filter('piklist_post_types', '<%= functionPrefix %>_register_post_type_<%= underscoreName %>');
