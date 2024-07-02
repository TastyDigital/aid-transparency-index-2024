<?php


	add_filter( 'genesis_site_layout', '__genesis_return_full_width_content' );





	//remove_action( 'genesis_entry_header', 'genesis_post_info', 12 );

	remove_action( 'genesis_loop', 'genesis_do_loop' );
	add_action('genesis_loop', 'ati_donors_chart_and_table');

	function ati_donors_chart_and_table(){
		$args = array(
			'post_type'		=> 'dlm_download',
			'tax_query'		=> array(
				array(
					'taxonomy'	=> 'dlm_download_tag',
					'field'		=> 'slug',
					'terms'		=> array('index-scores','2024-ati-report')
				)
			),
			'date_query' => array(
				array(
					'year'  => 2024
				),
			),
		);
		$report_downloads = '';
		$score_downloads = '';
		$downloads = get_posts( $args );
		if( ! empty( $downloads ) ){
			foreach ( $downloads as $d ){
				if( has_term( 'index-scores', 'dlm_download_tag', $d->ID) ) {
					$score_downloads .= '<div class="col-auto">'.do_shortcode('[download id="'.$d->ID.'" template="descriptive-button"]') .'</div>';
				}
				if( has_term( '2024-ati-report', 'dlm_download_tag', $d->ID) ) {
					$report_downloads .= '<div class="col-auto">'.do_shortcode('[download id="'.$d->ID.'" template="descriptive-button"]') .'</div>';
				}
				//echo '<pre>'.print_r($d, true).'</pre>';

			}
		}


		genesis_markup(
			[
				'open'    => '<article %s>',
				'context' => 'aid-transparency-index-2024',
			]
		);
		genesis_entry_header_markup_open();
		genesis_markup(
			[
				'open'    => '<h1 %s>',
				'close'   => '</h1>',
				'content' => apply_filters( 'Aid_Transparency_Index_2024_title', __( '2024 Aid Transparency Index <span class="year-published"><span>#2024Index</span></span>', 'aid-transparency-index-2024' ) ),
				'context' => 'entry-title',
			]
		);
		genesis_entry_header_markup_close();
		genesis_markup(
			[
				'open'    => '<div %s>',
				'context' => 'entry-content',
			]
		);
		echo '<div class="intro">';
		echo '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="mouse" viewBox="0 0 1200 1200">
        <g fill="currentColor">
			<path d="m794.86 310.92-90.703-90.703c-66.703-66.703-154.45-100.08-242.06-100.08-81.609 0-163.22 28.922-227.86 86.766l81.609 81.609c31.078-18.703 72.141-14.766 98.859 12l80.625 80.766c26.766 26.766 30.703 67.781 12 98.859l59.156 59.156z"/>
			<path d="m220.08 704.29 90.703 90.703 228.24-228.24-59.156-59.156c-12.844 7.6875-27.234 11.625-41.766 11.625-20.766 0-41.391-7.9219-57.234-23.625l-80.625-80.625c-26.766-26.766-30.703-67.781-12-98.859l-81.609-81.609c-119.86 134.29-115.45 341.06 13.312 469.92z"/>
			<path d="m822.47 338.39-484.08 484.08 157.31 157.31c133.45 133.45 350.63 133.45 484.08 0 64.688-64.688 100.22-150.61 100.22-242.06 0-91.453-35.625-177.37-100.22-242.06l-157.31-157.31z"/>
			<path d="m468 468.14c16.312-16.312 16.312-42.938 0-59.391l-80.625-80.766c-16.312-16.312-42.938-16.312-59.391 0-16.312 16.312-16.312 42.938 0 59.391l80.625 80.625c16.312 16.312 42.938 16.312 59.391 0z"/>
		</g>
      </symbol>
    </svg>';
		echo '<p class="lead mb-8">'.__('The Aid Transparency Index is the only independent measure of aid transparency among the world’s major development agencies. It is researched and produced by Publish What You Fund. See the 2024 results below. ', 'aid-transparency-index-2024').'</p>';
		


		if( ! empty( $report_downloads ) ) {
			echo '<div class="ati-reports-downloads row">' . $report_downloads . '</div>';
		}

		echo '<div class="d-flex align-items-center flex-row mx-auto mb-3" style="max-width: 900px;"><svg class="mr-3 flex-grow-1 d-none d-md-block" style="width:90px;height:90px;opacity:.75"><use href="#mouse"></use></svg>';
		echo '<p class="flex-grow-1 m-0">'.__('Roll over the graph to see how scores have changed since 2022. Click once to view more information about an agency’s performance and click again to access a detailed agency profile.', 'aid-transparency-index-2024').'</p></div>';
		echo '</div>';

		echo do_shortcode('[ati-graphs-2024 display="barchart" ]');


		if( ! empty( $score_downloads ) ) {
			echo '<div class="ati-scores-downloads row">' . $score_downloads . '</div>';
		}
		//echo do_shortcode('[download id="13376" template="descriptive-button"]');

		echo do_shortcode('[ati-graphs-2024 display="table" ]');


		if ( have_posts() ) {
			echo '<noscript>
			<p style="margin-top:2rem">Javascript must be enabled to view interactive graphs and tables. You can still view datasheets and analysis via the links below</p>';
			while ( have_posts() ) {
				the_post();
				genesis_do_post_title();

			}
			echo '</noscript>';
		}




		genesis_markup(
			[
				'close'   => '</div>',
				'context' => 'entry-content',
			]
		);
		genesis_markup(
			[
				'close'   => '</article>',
				'context' => 'aid-transparency-index-2024',
			]
		);

	}
	genesis();