<?php
/**
 * The Sidebar containing the main widget areas.
 *
 * @package base-theme
 */
?>
<div id="secondary" class="sidebar widget-area" role="complementary">

  <div class="widgets">
    <?php
      do_action( 'before_sidebar' );
      if ( ! dynamic_sidebar( 'sidebar-1' ) ) :
      endif;
    ?>
  </div>

</div><!-- #secondary -->