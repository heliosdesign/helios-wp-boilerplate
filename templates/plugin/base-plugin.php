<?php
/*
Plugin Name: Helios WP Boilerplate Functionality Plugin
Description: Declares a plugin that will create a admin functionality for the Helios WP Boilerplate themes.
Version: 0.0.0
Author: Helios Design Labs
Author URI: http://heliosdesignlabs.com/
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) { die; }


require_once( plugin_dir_path( __FILE__ ) . 'inc/class-base-plugin-config.php' );

/**
 * Register Activation Hook
 *
 * Uncomment if you want this function to fire when the plugin is activated.
 */
// register_activation_hook( __FILE__, 'base_plugin_activation' );

// function base_plugin_activation() {
//   $config = new Base_Plugin_Config();

//   $config->register_custom_post_types();
//   flush_rewrite_rules();
// }

$config = new Base_Plugin_Config();
$config->initialize();

// register_deactivation_hook( __FILE__, 'base_plugin_deactivation' ) );

// function base_plugin_deactivation() {}
?>