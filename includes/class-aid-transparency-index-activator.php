<?php

/**
 * Fired during plugin activation
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 * @author     Tasty Digital Ltd <developers@tastydigital.com>
 */
class Aid_Transparency_Index_2024_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
			include_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		if ( ! current_user_can( 'activate_plugins' ) ) {
			// Deactivate the plugin.
			deactivate_plugins( plugin_basename( __FILE__ ) );

			$error_message = __( 'You do not have proper authorization to activate a plugin!', 'pwyf-ati' );
			die( esc_html( $error_message ) );
		}
        if ( ! defined( 'CMB2_LOADED' ) ) {
			// Deactivate the plugin.
			deactivate_plugins( plugin_basename( __FILE__ ) );
			// Throw an error in the WordPress admin console.
			$error_message = __( 'This plugin requires the ', 'pwyf-ati' ) . '<a href="' . esc_url( 'https://wordpress.org/plugins/cmb2/' ) . '">CMB2</a>' . __( ' plugin to be active!', 'pwyf-ati' );
			die( wp_kses_post( $error_message ) );
		}
	}

}

