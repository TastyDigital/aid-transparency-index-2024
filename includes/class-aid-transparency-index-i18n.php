<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 * @author     Tasty Digital Ltd <developers@tastydigital.com>
 */
class Aid_Transparency_Index_2024_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'aid-transparency-index-2024',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
