<?php
/**
 * Basic function setup.
 */


/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 *
 */

if ( ! function_exists( 'helios_setup' ) ):
  
  function helios_setup() {

    /**
     * Add default posts and comments RSS feed links to head
     */
    add_theme_support( 'automatic-feed-links' );

    /**
     * Enable support for Post Thumbnails
     */
    add_theme_support( 'post-thumbnails' );

    /**
     * This theme uses wp_nav_menu() in one location.
     */
    register_nav_menus( array(
      'primary' => __( 'Primary Menu', 'helios' ),
    ) );

    /**
     * Add support for Post Formats
     */
    add_theme_support( 'post-formats', array( /*'aside', 'audio', 'image', 'link', 'quote', 'video'*/ ) );
  }

endif;

add_action( 'after_setup_theme', 'helios_setup' );

/**
 * Register widgetized area and update sidebar with default widgets
 */
if ( ! function_exists( 'helios_widgets_init') ) :

  function helios_widgets_init() {

    register_sidebar( array(
      'name'          => __( 'Main Sidebar', 'helios' ),
      'id'            => 'sidebar-1',
      'description'   => __( 'Widgets in this area will be shown on all posts and pages.', 'helios' ),
      'before_widget' => '<aside id="%1$s" class="widget %2$s">',
      'after_widget'  => '</aside>',
      'before_title'  => '<h1 class="widget-title">',
      'after_title'   => '</h1>',
    ) );

  }

endif;

add_action( 'widgets_init', 'helios_widgets_init' );

?>