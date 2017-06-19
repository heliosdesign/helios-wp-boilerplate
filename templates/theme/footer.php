  </div><?php // .site-main ?>

  <footer id="colophon" class="site-footer" role="contentinfo">
  </footer><?php // .site-footer ?>

<?php wp_footer(); ?>

<?php
  if ( is_super_admin() ) {
    $db_info = array(
      'seconds' => timer_stop( 0 ),
      'queries' => $wpdb->num_queries
    );
    echo '<script>console.log('.json_encode( $db_info ).');</script>';
  }
?>

</body>
</html>