<?php
/**
 * Enqueue scripts and styles
 */ 
if ( ! function_exists( 'helios_scripts' ) ) :

  function helios_scripts() {
    $theme = wp_get_theme();
    $version = $theme->get( 'Version' );
    $cache_buster = ! empty( $version ) ? $version : '0.0.0.';

    wp_enqueue_style( 'main-style', get_stylesheet_uri(), array(), $cache_buster );

    wp_enqueue_script( 'main-script', get_template_directory_uri() . '/js/main.bundle.js', array('jquery'), $cache_buster, true );
    wp_enqueue_script( 'secondary-script', get_template_directory_uri() . '/js/secondary.bundle.js', array('jquery'), $cache_buster, true );
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