<?php
/**
 * Enqueue scripts and styles
 */ 
if ( ! function_exists( 'helios_scripts' ) ) :

  function helios_scripts() {
    $cache_buster = '0.0.0';

    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), $cache_buster );

    // wp_enqueue_style( 'old-ie', get_template_directory_uri() . '/css/oldie.css', array( 'style' ), null );
    // wp_style_add_data( 'old-ie', 'conditional', 'lt IE 9' );

    if ( DEV_ENV === true ) {
      wp_enqueue_script( 'example-script', get_template_directory_uri() . '/src/js/example.js', array( 'jquery' ), null, true );
    } else {
      wp_enqueue_script( 'application-script', get_template_directory_uri() . '/js/application.min.js', array('jquery'), $cache_buster, true );
    }
      
  }

endif;

add_action( 'wp_enqueue_scripts', 'helios_scripts' );

/**
 * Add IE conditional HTML5 shim to header.
 */
if ( ! function_exists( 'helios_html5_shim' ) ) :
  function helios_html5_shim () {
    echo '<!--[if lt IE 9]>';
    echo '<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>';
    echo '<![endif]-->';
  }
endif;

add_action( 'wp_head', 'helios_html5_shim' );

?>