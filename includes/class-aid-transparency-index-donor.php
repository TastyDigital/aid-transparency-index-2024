<?php

	use PostTypes\PostType;
	use PostTypes\Taxonomy;


	if (!function_exists('write_log')) {

		function write_log($log) {
			if (true === WP_DEBUG) {
				if (is_array($log) || is_object($log)) {
					error_log(print_r($log, true));
				} else {
					error_log($log);
				}
			}
		}

	}


	add_image_size( 'graph-thumb', 70, 70, TRUE );
    if(!defined('ATI_LANGUAGES')) {
        define( 'ATI_LANGUAGES',  array(
            'en' => __( 'English', 'aid-transparency-index-2024'  ),
            'fr'   => __( 'French', 'aid-transparency-index-2024'  ),
            'es'   => __( 'Spanish', 'aid-transparency-index-2024'  ),
        ));
    }


	$donor_names_2024 = [
		'name' => 'donor_2024',
		'singular' => '2024 Donor',
		'plural' => '2024 Index',
		'slug' => 'donors-2024',
	];

//	add_filter( 'redirect_canonical', 'ati_block_early_access', 11, 2 );
//	function ati_block_early_access($redirect_url, $requested_url){
//		if (strpos($requested_url, '/the-index/2024/') !== false) {
//			return false;
//		}
//		return $redirect_url;
//	}
	$donor_options_2024 = [
         'rewrite' => array( 'slug' => 'the-index/2024' ),
         'has_archive' => 'the-index/2024',
//		'rewrite' => array( 'slug' => 'temp-index-url/2024' ),
//		'has_archive' => 'temp-index-url/2024',
		'menu_position' => 20,
		'menu_icon' => 'dashicons-money',
		'supports' => array('title', 'editor', 'revisions', 'thumbnail'),
		'show_in_rest' => true,
		'rest_base'    => 'donors2024',
		'public'       => true
	];

	$donor_labels_2024 = [
		'featured_image' => __( 'Graph Image', 'textdomain' ),
		'set_featured_image' => __( 'Set graph image', 'textdomain' ),
		'remove_featured_image' => _x( 'Remove graph image', 'textdomain' ),
		'use_featured_image' => _x( 'Use as graph image', 'textdomain' )
	];

// Create a books Post Type
	$donors_2024 = new PostType($donor_names_2024, $donor_options_2024, $donor_labels_2024);
// Add a Group Taxonomy
	$donors_2024->taxonomy('country_group_2024');

// define the columns to appear on the admin edit screen
	$donors_2024->columns()->set([
		'cb' => '<input type="checkbox" />',
		'title' => __('Full name on Donor Profile', 'aid-transparency-index-2024'),
		'donor_code' => __("Donor code", 'aid-transparency-index-2024'),
		'language' => __('Language', 'aid-transparency-index-2024' ),
		'country' => __('Country', 'aid-transparency-index-2024'),
		'icon' => __('Graph', 'aid-transparency-index-2024')
	]);

// Hide the date and author columns
//$stock->columns()->hide(['date', 'author']);


	$donors_2024->columns()->populate('language', function($column, $post_id) {
		$value = get_post_meta( $post_id, 'ati_page_2024_meta_language', true );
		if ( is_wp_error( $value ) ) {
			// something went wrong
			echo $value->get_error_message();
		}else if(isset(ATI_LANGUAGES[$value])){
			echo ATI_LANGUAGES[ $value ];
		}
	});

	$donors_2024->columns()->populate('country', function($column, $post_id) {
		//$post = get_post($post_id);
		//echo get_the_post_thumbnail($post_id);

		$value = get_the_term_list( $post_id, 'country_group_2024' );
		if ( is_wp_error( $value ) ) {
			// something went wrong
			echo $value->get_error_message();
		}else{
			echo $value;
		}
		//echo esc_html( $val );
	});

	$donors_2024->columns()->populate('icon', function($column, $post_id) {
		//$post = get_post($post_id);
		//echo get_the_post_thumbnail($post_id);

		$value = get_the_post_thumbnail( $post_id, 'graph-thumb' );
		if ( is_wp_error( $value ) ) {
			// something went wrong
			echo $value->get_error_message();
		}else{
			echo $value;
		}
		//echo esc_html( $val );
	});
	$donors_2024->columns()->populate('donor_code', function($column, $post_id) {
		//$post = get_post($post_id);
		//echo get_the_post_thumbnail($post_id);

		$value = get_post_meta( $post_id, 'ati_donor_meta_2024_code', true );
		if ( is_wp_error( $value ) ) {
			// something went wrong
			echo $value->get_error_message();
		}else{
			echo $value;
		}
		//echo esc_html( $val );
	});

// make sortable
	$donors_2024->columns()->sortable([
		'country' => ['country_group_2024', true],
		'donor_code' => ['ati_donor_meta_2024_code', true],
		'language' => ['ati_page_2024_meta_language', true]
	]);

	$donors_2024->register();


	$tcountries_2024 = [
		'name' => 'country_group_2024',
		'singular' => 'Country',
		'plural' => 'Countries',
		'slug' => 'country'
	];

	$countries_2024 = new Taxonomy($tcountries_2024);

// Set options for the taxonomy.
	$countries_2024->options( [
		'hierarchical' => true,
		'show_in_rest' => true
	] );

	$countries_2024->register();

	function ati_pull_all_donors_2024( $query ) {
		if ( ! is_admin() && $query->is_main_query() && is_post_type_archive( 'donor_2024' ) ) {
			// Display 50 posts for a custom post type called 'donor'
			$query->set( 'posts_per_page', 100 );
			return;
		}
	}
	add_action( 'pre_get_posts', 'ati_pull_all_donors_2024', 1 );



/* Custom meta fields (requires CMB2 mu-plugin */



add_action( 'cmb2_init', 'tasty_register_donor_metabox_2024' );

	function tasty_register_donor_metabox_2024() {
		$prefix = 'ati_donor_meta_2024_';
		$donor_meta = new_cmb2_box( array(
			'id'            => $prefix . 'metabox',
			'title'         => esc_html__( 'Donor details', 'aid-transparency-index-2024' ),
			'object_types'  => array( 'donor_2024' ), // Post type
			'priority'   => 'high',
			'show_in_rest' => WP_REST_Server::READABLE
		) );
		$donor_meta->add_field( array(
			'name'       => esc_html__( 'Donor code', 'aid-transparency-index-2024' ),
			'description'=> esc_html__( 'Case insensitive. Must match the donor’s organisation_name field in the results data', 'aid-transparency-index-2024' ),
			'id'         => $prefix . 'code',
			'type'       => 'text_medium'
		) );

		$donor_meta->add_field( array(
			'name'       => esc_html__( 'Footnote', 'aid-transparency-index-2024' ),
			'description'=> esc_html__( 'Can reference * or † if in title, appears below summary.', 'aid-transparency-index-2024' ),
			'id'         => $prefix . 'footnote',
			'type'       => 'textarea_small'
		) );

//		$donor_meta->add_field( array(
//			'name'    => esc_html__( 'Analysis', 'aid-transparency-index-2024' ),
//			'id'      => $prefix . 'analysis',
//			'type'    => 'wysiwyg',
//			'options' => array(
//				'wpautop' => true, // use wpautop?
//				'media_buttons' => false, // show insert/upload button(s)
//				'teeny' => true, // output the minimal editor config used in Press This
//			),
//		) );

		$donor_meta->add_field( array(
			'name'    => esc_html__( 'Recommendations', 'aid-transparency-index-2024' ),
			'desc'    => esc_html__( 'List of points outlining recommendations for improvement', 'aid-transparency-index-2024' ),
			'id'      => $prefix . 'recommendations',
			'type'    => 'wysiwyg',
			'options' => array(
				'wpautop' => true, // use wpautop?
				'media_buttons' => false, // show insert/upload button(s)
				'teeny' => true, // output the minimal editor config used in Press This
			),
		) );

		/*----*/

		$prefix2 = 'ati_page_2024_meta_';
		$page_meta = new_cmb2_box( array(
			'id'            => $prefix2 . 'details',
			'title'         => esc_html__( 'Page details', 'aid-transparency-index-2024' ),
			'object_types'  => array( 'donor_2024' ), // Post type
			'priority'   => 'high',
			'show_in_rest' => WP_REST_Server::READABLE
		) );
		$page_meta->add_field( array(
			'name'    => esc_html__( 'Language', 'aid-transparency-index-2024' ),
			'id'      => $prefix2 . 'language',
			'type'    => 'radio_inline',
			'options' => ATI_LANGUAGES,
			'default' => 'en',
		) );
		// enabling this requires changing 'save_post_donor' hook to 'save_post' in admin scripts
//		$page_meta->add_field( array(
//			'name'    => esc_html__( 'Download Monitor ID', 'aid-transparency-index-2024' ),
//			'id'      => $prefix2 . 'pdf_download_id_2024',
//			'type'    => 'text_small'
//		) );

	}

	//add_action( "cmb2_after_post_form_ati_page_2024_meta_details", 'add_link_to_datasheet_download_monitor_2024' );
	function add_link_to_datasheet_download_monitor_2024(){
		$download_id = get_post_meta( get_the_ID(), 'ati_page_2024_meta_pdf_download_id_2024', true );
		$download = get_post($download_id );
		if( !empty($download) && $download->post_type === 'dlm_download' && $download->post_status !== 'trash' ){
			//echo '<p> <a href="'.get_permalink($download_id).'">'.$download->post_title.'</a> </p>';
			edit_post_link($download->post_title, __('Associated datasheet download: ','aid-transparency-index-2024'), '', $download_id);
		}
	}

	// updated structured data for translated content
	add_filter( 'wpseo_schema_piece_language', 'ati_add_language_piece_2024', 11, 1 );
	add_filter( 'wpseo_og_locale', 'ati_add_language_piece_2024', 11, 1 );
	function ati_add_language_piece_2024($data){
		$lang = get_post_meta( get_the_ID(), 'ati_page_2024_meta_language', true );
		if(!empty($lang)){
			return $lang;
		}
		return $data;
	}



