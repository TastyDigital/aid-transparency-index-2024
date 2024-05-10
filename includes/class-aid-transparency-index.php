<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/includes
 * @author     Tasty Digital Ltd <developers@tastydigital.com>
 */


class Aid_Transparency_Index_2024 {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Aid_Transparency_Index_2024_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'Aid_Transparency_Index_2024_VERSION' ) ) {
			$this->version = Aid_Transparency_Index_2024_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'aid-transparency-index-2024';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Aid_Transparency_Index_2024_Loader. Orchestrates the hooks of the plugin.
	 * - Aid_Transparency_Index_2024_i18n. Defines internationalization functionality.
	 * - Aid_Transparency_Index_2024_Admin. Defines all hooks for the admin area.
	 * - Aid_Transparency_Index_2024_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {


		if( file_exists(WPMU_PLUGIN_DIR.'/cmb2/init.php') ){
			require_once WPMU_PLUGIN_DIR.'/cmb2/init.php';
		}
		else if( file_exists(WP_PLUGIN_DIR.'/cmb2/init.php') ){
			require_once WP_PLUGIN_DIR.'/cmb2/init.php';
		}
		//require_once __DIR__ . '/../vendor/autoload.php';
		if(file_exists(dirname(__DIR__ ) . '/vendor/autoload.php' )){
			require_once dirname(__DIR__ ) . '/vendor/autoload.php';
		}elseif( file_exists(dirname(__DIR__ ,5). '/vendor/autoload.php') ){
			require_once dirname(__DIR__ ,5). '/vendor/autoload.php';
		}

		require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-donor.php';
		require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-components.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once ATI_2024_INCLUDES . '/class-aid-transparency-index-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-aid-transparency-index-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-aid-transparency-index-public.php';

		$this->loader = new Aid_Transparency_Index_2024_Loader();





	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Aid_Transparency_Index_2024_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Aid_Transparency_Index_2024_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Aid_Transparency_Index_2024_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'save_post_donor_2024', $plugin_admin, 'save_donor_pdf' );
		$this->loader->add_action( 'save_post_donor_2024', $plugin_admin, 'save_donor_thumbnail', 11 );
		//$this->loader->add_action( 'save_post', $plugin_admin, 'save_donor_pdf', 11 );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Aid_Transparency_Index_2024_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		$this->loader->add_filter( 'script_loader_tag', $plugin_public, 'defer_widget_scripts', 10, 2);

		$this->loader->add_filter( 'single_template', $plugin_public, 'ati_single_donor_template', 10);
		$this->loader->add_filter('template_include', $plugin_public, 'ati_donor_archive_template', 10);

		//$this->loader->add_filter('genesis_breadcrumb_link', $plugin_public, 'ati_donor_breadcrumb_custom', 20, 5);

		// Create a short code for the plugin's user in the form:  [ati-graphs-2024]
		$this->loader->add_shortcode( 'ati-graphs-2024', $plugin_public, 'ati_graphs_shortcode_2024' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Aid_Transparency_Index_2024_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
