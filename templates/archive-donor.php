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
					'year'  => 2022
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
				if( has_term( '2022-ati-report', 'dlm_download_tag', $d->ID) ) {
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
				'content' => apply_filters( 'Aid_Transparency_Index_2022_title', __( 'Aid Transparency Index <span class="year-published"><span>#2022Index</span></span>', 'aid-transparency-index-2024' ) ),
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
		echo '<p class="lead">'.__('The Aid Transparency Index is the only independent measure of aid transparency among the world’s major development agencies. It is researched and produced by Publish What You Fund.', 'aid-transparency-index-2024').'</p>';


		if( ! empty( $report_downloads ) ) {
			echo '<div class="ati-reports-downloads row">' . $report_downloads . '</div>';
		}

		echo '<!-- <p>'.__('Double click on the chart below to read more about the performance of each agency.', 'aid-transparency-index-2024').'</p> -->';
		echo '</div>';

		echo do_shortcode('[ati-graphs-2022 display="barchart" ]');


		if( ! empty( $score_downloads ) ) {
			echo '<div class="ati-scores-downloads row">' . $score_downloads . '</div>';
		}
		//echo do_shortcode('[download id="13376" template="descriptive-button"]');

		echo do_shortcode('[ati-graphs-2022 display="table" ]');


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