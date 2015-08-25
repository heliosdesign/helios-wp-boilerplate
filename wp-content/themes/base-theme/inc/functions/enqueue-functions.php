<?php
/**
 * Enqueue scripts and styles
 */ 
if ( ! function_exists( 'wpstarter_scripts' ) ) :

  function wpstarter_scripts() {
    $theme = wp_get_theme();

    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), $theme->get( 'Version' ) );
    // wp_enqueue_style( 'old-ie', get_template_directory_uri() . '/css/oldie.css', array( 'style' ), null );
    // wp_style_add_data( 'old-ie', 'conditional', 'lt IE 9' );

    wp_enqueue_script( 'main-script', get_template_directory_uri() . '/js/main.min.js', array( 'jquery' ), null, true );
  }

endif;

add_action( 'wp_enqueue_scripts', 'wpstarter_scripts' );

/**
 * Add IE conditional HTML5 shim to header.
 */
function wpstarter_html5_shim () {
  echo '<!--[if lt IE 9]>';
  echo '<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>';
  echo '<![endif]-->';
}
add_action('wp_head', 'wpstarter_html5_shim');

?>