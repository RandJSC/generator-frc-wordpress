function <%= functionPrefix %>_register_post_type_<%= underscoreName %>($post_types) {

  $labels = piklist('post_type_labels', '<%= pluralLabel %>');
  $labels['name'] = '<%= pluralLabel %>';

  $post_types['<%= name %>'] = array(
    'labels' => $labels,
    'title'  => 'Enter a Title...',
  );

}
