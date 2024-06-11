<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/public
 * @author     Tasty Digital Ltd <developers@tastydigital.com>
 */
class Aid_Transparency_Index_2024_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Aid_Transparency_Index_2024_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Aid_Transparency_Index_2024_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		if ( get_post_type( get_the_ID() ) === 'donor_2024'  || is_post_type_archive('donor_2024') ){
			wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/aid-transparency-index-public.css', array( get_stylesheet() ), filemtime( plugin_dir_path( __FILE__ ) . 'css/aid-transparency-index-public.css' ), 'all' );
		}
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Aid_Transparency_Index_2024_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Aid_Transparency_Index_2024_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		//write_log(basename(__FILE__, '.php'));
		if ( get_post_type( get_the_ID() ) === 'donor_2024' || is_post_type_archive('donor_2024') ) {
			// this script depends on jquery and the bootstrap 4 library, using get_stylesheet() as expect this to be loaded with theme
			wp_enqueue_script('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js', array( 'jquery' ), '4.6.2', true);
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/aid-transparency-index-public.js', array(
				'jquery',
				'bootstrap'
			), filemtime( plugin_dir_path( __FILE__ ) . 'js/aid-transparency-index-public.js' ), true );
			//wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/aid-transparency-index-public.js', array( 'jquery', get_stylesheet()), filemtime( plugin_dir_path( __FILE__ ) . 'js/aid-transparency-index-public.js'), true);

			//* wp-scripts react scripts *//
			if ( file_exists( ATI_2024_ASSET_FILE ) ) {
				$asset_file = include( ATI_2024_ASSET_FILE );
				wp_enqueue_script(
					'ati-main-2024',
					plugin_dir_url( __DIR__ ) . 'widget/build/index.js',
					$asset_file['dependencies'],
					$asset_file['version'],
					true
				);
				wp_enqueue_style( 'ati-2024', plugin_dir_url( __DIR__ ) . 'widget/build/index.css', [], $asset_file['version'] );
			}
		}
	}
	public function defer_widget_scripts( $tag, $handle ) {
		if ( ! preg_match( '/^ati-/', $handle ) ) { return $tag; }
		return str_replace( ' src', ' async defer src', $tag );
	}

//	/* replaced this by renaming plural CPT instead */
//  public function ati_donor_breadcrumb_custom($link, $url, $title, $content){
//		if($content === 'Donors' && wp_get_theme()->parent() == 'Genesis'){
//			$link_text = genesis_markup(
//				[
//					'open'    => '<span %s>',
//					'close'   => '</span>',
//					'content' => __('ATI 2024', 'aid-transparency-index-2024'),
//					'context' => 'breadcrumb-link-text-wrap',
//					'echo'    => false,
//				]
//			);
//			$link = genesis_markup(
//				[
//					'open'    => '<a %s>',
//					'close'   => '</a>',
//					'content' => $link_text,
//					'context' => 'breadcrumb-link',
//					'params'  => [
//						'href' => $url,
//					],
//					'echo'    => false,
//				]
//			);
//		}
//		return $link;
//	}
	public function ati_single_donor_template($single) {
		/* Checks for single template by post type, also our template is for Genesis theme */
		if ( get_post_type( get_the_ID() ) === 'donor_2024' && wp_get_theme()->parent() == 'Genesis') {
			//echo '<h1>'.plugin_dir_path( __DIR__ ) . 'templates/single-donor.php</h1>';
			if ( file_exists( plugin_dir_path( __DIR__ ) . 'templates/single-donor.php' ) ) {
				return plugin_dir_path( __DIR__ ) . 'templates/single-donor.php';
			}
		}
		return $single;
	}
	public function ati_donor_archive_template($template) {
		if ( is_post_type_archive('donor_2024') ) {
			$theme_files = array('archive-donor.php', 'aid-transparency-index-2024/archive-donor.php');
			$exists_in_theme = locate_template($theme_files, false);
			if ( $exists_in_theme != '' ) {
				return $exists_in_theme;
			} else if (wp_get_theme()->parent() == 'Genesis'){
				return plugin_dir_path( __DIR__ ) . 'templates/archive-donor.php';
			}
		}
		return $template;
	}
	public function ati_graphs_shortcode_2024( $atts, $content = null ) {
		ob_start();
		include( 'partials/'.$this->plugin_name.'-public-display.php' );
		return ob_get_clean();
	}

}
