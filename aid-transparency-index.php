<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://tastydigital.com
 * @since             1.0.1
 * @package           Aid_Transparency_Index_2024
 *
 * @wordpress-plugin
 * Plugin Name:       Aid Transparency Index 2024
 * Plugin URI:        https://www.publishwhatyoufund.org
 * Description:       Supports displaying 2024 donor information for Publish What You Fund’s Aid Transparency Index.
 * Version:           1.0.0
 * Author:            Tasty Digital Ltd
 * Author URI:        https://tastydigital.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       aid-transparency-index-2024
 * Domain Path:       /languages
 */


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'Aid_Transparency_Index_2024_VERSION', '1.0.1' );
define( 'ATI_2024_WIDGET_PATH', plugin_dir_path( __FILE__ ) . 'widget' );
define( 'ATI_2024_ASSET_FILE', ATI_2024_WIDGET_PATH . '/build/index.asset.php' );
define( 'ATI_2024_INCLUDES', plugin_dir_path( __FILE__ ) . 'includes' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-aid-transparency-index-activator.php
 */
function activate_Aid_Transparency_Index_2024() {
	require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-activator.php';
	Aid_Transparency_Index_2024_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-aid-transparency-index-deactivator.php
 */
function deactivate_Aid_Transparency_Index_2024() {
	require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-deactivator.php';
	Aid_Transparency_Index_2024_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_Aid_Transparency_Index_2024' );
register_deactivation_hook( __FILE__, 'deactivate_Aid_Transparency_Index_2024' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require ATI_2024_INCLUDES . '/class-aid-transparency-index.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_Aid_Transparency_Index_2024() {

	$plugin = new Aid_Transparency_Index_2024();
	$plugin->run();

}
run_Aid_Transparency_Index_2024();
