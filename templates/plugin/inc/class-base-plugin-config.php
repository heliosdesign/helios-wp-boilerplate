<?php

class Base_Plugin_Config {
  protected $cache = '0.0.0';

  /**
   * Constructor function.
   *
   * @since     0.0.0
   */
  public function __construct() {
    $this->load_dependencies();
  }

  /**
   * Load the required dependencies.
   *
   * @since    0.0.0
   * @access   private
   */
  private function load_dependencies() {
    // require_once( plugin_dir_path( __FILE__ ) . 'admin-classes/class-custom-post-type.php' );
    // require_once( plugin_dir_path( __FILE__ ) . 'admin-classes/class-meta-boxes.php' );
    // require_once( plugin_dir_path( __FILE__ ) . 'admin-classes/class-settings.php' );
    // require_once( plugin_dir_path( __FILE__ ) . 'admin-classes/class-shortcodes.php' );
  }

  /**
   * Kick everything off.
   *
   * Add actions and shortcodes.
   *
   * @since    1.0.0
   * @access   private
   */
  public function initialize() {

    add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
    // add_action( 'init', array( $this, 'register_custom_post_types' ) );

  }


  /**
   * Register scripts and register and enqueue styles.
   *
   * @since    0.0.0
   */
  public function register_scripts() {
    // global $post;

    wp_register_style( 'base-plugin-style', plugin_dir_url( dirname( __FILE__ ) ) . 'css/plugin.css', array(), $this->cache );
    wp_register_script( 'base-plugin-script', plugin_dir_url( dirname( __FILE__ ) ) . 'js/plugin.bundle.js', array( 'jquery' ), $this->cache, true );

    wp_enqueue_style( 'base-plugin-style' );
    wp_enqueue_script( 'base-plugin-script' );
  }

  /**
   * Register any custom post types here.
   *
   * @since     0.0.0
   */
  public function register_custom_post_types() {

  }
  
}

?>