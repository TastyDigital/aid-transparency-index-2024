<?php
	/**
	 * Adds a submenu page under a custom post type parent.
	 */

//	add_action('admin_menu', 'donors_register_ref_page');
//	function donors_register_ref_page() {
//		add_submenu_page(
//			'edit.php?post_type=donor_2024',
//			__( 'Component definitions', 'aid-transparency-index-2024' ),
//			__( 'Component definitions', 'aid-transparency-index-2024' ),
//			'manage_options',
//			'admin.php?page=component-definitions'
//		);
//	}


	/**
	 * Hook in and register a metabox to handle donor options page and adds a menu item.
	 */
	function pwyf_ati_register_options_submenu_for_donor_post_type_2024() {




        include_once 'components-and-indicators.php'; // imports variable $components_and_indicators

		/**
		 * Register main donor options args
		 */
		$args = array(
			'id'           => 'pwyf_ati_donor_options_2024_page',
			//'menu_title'   => esc_html__( 'Component Info', 'aid-transparency-index-2024' ),
			'object_types' => array( 'options-page' ),
			'parent_slug'  => 'edit.php?post_type=donor_2024', // Make options page a submenu item of the themes menu.
			'tab_group'    => 'pwyf_ati_donor_options_2024',
			'display_cb'   => 'pwyf_ati_options_display_with_tabs_2024',
			// 'icon_url'        => '', // Menu icon. Only applicable if 'parent_slug' is left empty.
			// 'menu_title'      => esc_html__( 'Options', 'aid-transparency-index-2024' ), // Falls back to 'title' (above).
			// 'capability'      => 'manage_options', // Cap required to view options-page.
			// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
			// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
			// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
			// 'save_button'     => esc_html__( 'Save Theme Options', 'aid-transparency-index-2024' ), // The text for the options-page save button. Defaults to 'Save'.
			// 'disable_settings_errors' => true, // On settings pages (not options-general.php sub-pages), allows disabling.
			// 'message_cb'      => 'pwyf_ati_options_page_message_callback',
		);
		foreach ( $components_and_indicators as $key => $component ) {
		    $idString = str_replace(' ', '_', strtolower($component['title']));
		    $args['id'] = $idString . '_page_2024';
//		    if(empty($args['option_key'])){
//			    $args['option_key'] = 'component-definitions';
//            }else{
			    $args['option_key'] = $idString.'_2024';
          //  }
			//$args['tab_group']  = $idString;
			$args['tab_title']  = $component['title'];
			$args['title']  = esc_html__( $component['title'], 'aid-transparency-index-2024' );

			$meta_options[$key] = new_cmb2_box( $args );
			/**
			 * Options fields ids only need
			 * to be unique within this box.
			 * Prefix is not needed.
			 */
            foreach( ATI_LANGUAGES as $lang => $language ) {

                $meta_options[$key]->add_field( array(
                    'name' => '“'.$component['title'].'” component ('.$language.')',
                    'type' => 'title',
                    'id'      => 'component_'.$lang.'_translations',
                ) );
                $meta_options[$key]->add_field( array(
                    'name'    => 'Component title ('.$language.')',
                    'desc'    => 'How this component is referenced in the ATI',
                    'id'      => 'title_'.$lang,
                    'type'    => 'text',
                    'default' => $component['title'],
                ) );
                $meta_options[$key]->add_field( array(
                    'name'    => 'Component description ('.$language.')',
                    'desc'    => 'Why is this component important?',
                    'id'      => 'description_'.$lang,
                    'type'    => 'textarea'
                ) );
                $meta_options[$key]->add_field( array(
                    'name' => '“'.$component['title'].'” Component Indicators ('.$language.')',
                    'desc' => 'Populate the definitions of this component’s indicators in '.$language.' here',
                    'type' => 'title',
                    'id'   => 'indicators_title_'.$lang,
                ) );
                foreach ( $component['indicators'] as $indicator ) {
                    $inString = str_replace(' ', '_', strtolower($indicator)).'_2024';
                    $meta_options[$key]->add_field( array(
                        'name'    => $indicator . ' title ('.$language.')',
                        'id'      => $inString.'_title_'.$lang,
                        'type'    => 'text',
                        'default' => $indicator,
                    ) );
                    $meta_options[$key]->add_field( array(
                        'name'    => $indicator . ' definition ('.$language.')',
                        'desc'    => 'What does this indicator represent?',
                        'id'      => $inString.'_description_'.$lang,
                        'type'    => 'textarea'
                    ) );

                }
            }
		}
		if(class_exists('MC4WP_Admin')){
			remove_action( 'admin_notices', array( 'MC4WP_Admin', 'show_api_key_notice' ) );
		}

	}
	add_action( 'cmb2_admin_init', 'pwyf_ati_register_options_submenu_for_donor_post_type_2024' );

	/**
	 * A CMB2 options-page display callback override which adds tab navigation among
	 * CMB2 options pages which share this same display callback.
	 *
	 * @param CMB2_Options_Hookup $cmb_options The CMB2_Options_Hookup object.
	 */
	function pwyf_ati_options_display_with_tabs_2024( $cmb_options ) {
		$tabs = pwyf_ati_options_page_tabs_2024( $cmb_options );
		?>
		<div class="wrap cmb2-options-page option-<?php echo $cmb_options->option_key; ?>">
			<?php if ( get_admin_page_title() ) : ?>
				<h2><?php echo wp_kses_post( get_admin_page_title() ); ?></h2>
			<?php endif; ?>
			<h2 class="nav-tab-wrapper">
				<?php foreach ( $tabs as $option_key => $tab_title ) : ?>
					<a class="nav-tab<?php if ( isset( $_GET['page'] ) && $option_key === $_GET['page'] ) : ?> nav-tab-active<?php endif; ?>" href="<?php menu_page_url( $option_key ); ?>"><?php echo wp_kses_post( $tab_title ); ?></a>
				<?php endforeach; ?>
			</h2>
			<form class="cmb-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="POST" id="<?php echo $cmb_options->cmb->cmb_id; ?>" enctype="multipart/form-data" encoding="multipart/form-data">
				<input type="hidden" name="action" value="<?php echo esc_attr( $cmb_options->option_key ); ?>">
				<?php $cmb_options->options_page_metabox(); ?>
				<?php submit_button( esc_attr( $cmb_options->cmb->prop( 'save_button' ) ), 'primary', 'submit-cmb' ); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Gets navigation tabs array for CMB2 options pages which share the given
	 * display_cb param.
	 *
	 * @param CMB2_Options_Hookup $cmb_options The CMB2_Options_Hookup object.
	 *
	 * @return array Array of tab information.
	 */
	function pwyf_ati_options_page_tabs_2024( $cmb_options ) {
		$tab_group = $cmb_options->cmb->prop( 'tab_group' );
		$tabs      = array();

		foreach ( CMB2_Boxes::get_all() as $cmb_id => $cmb ) {
			if ( $tab_group === $cmb->prop( 'tab_group' ) ) {
				$tabs[ $cmb->options_page_keys()[0] ] = $cmb->prop( 'tab_title' )
					? $cmb->prop( 'tab_title' )
					: $cmb->prop( 'title' );
			}
		}

		return $tabs;
	}

	add_action('in_admin_header', function () {
		if ( !empty($_GET['post_type']) && $_GET['post_type'] !== 'donor_2024') return;
		remove_all_actions('admin_notices');
		remove_all_actions('all_admin_notices');
	}, 1000);



	/**
	 * Wrapper function around cmb2_get_option
	 * @since  0.1.0
     * @param  string $option_key My prefix fro custom meta
	 * @param  string $key     Options array key
	 * @param  mixed  $default Optional default value
	 * @return mixed           Option value
	 */
    if(!function_exists('ati_get_component_option')){
        function ati_get_component_option( $option_key = 'option_key', $key = '', $default = false ) {
            if ( function_exists( 'cmb2_get_option' ) ) {
                // Use cmb2_get_option as it passes through some key filters.
                return cmb2_get_option( $option_key, $key, $default );
            }

            // Fallback to get_option if CMB2 is not loaded yet.
            $opts = get_option( $option_key, $default );

            $val = $default;

            if ( 'all' == $key ) {
                $val = $opts;
            } elseif ( is_array( $opts ) && array_key_exists( $key, $opts ) && false !== $opts[ $key ] ) {
                $val = $opts[ $key ];
            }

            return $val;
        }
    }


