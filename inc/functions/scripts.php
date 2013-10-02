<?php

/**
 * Enqueue scripts and styles
 */
 
if ( ! function_exists( 'helios_scripts' ) ) :

    function helios_scripts() {
        wp_enqueue_style( 'style', get_stylesheet_uri() );

        wp_enqueue_script( 'main-scripts', get_template_directory_uri() . '/js/main.js', array( 'jquery' ), '1.0.0', true );
    }

endif;

add_action( 'wp_enqueue_scripts', 'helios_scripts' );

?>