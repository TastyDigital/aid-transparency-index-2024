<?php



	add_filter( 'genesis_site_layout', '__genesis_return_full_width_content' );

	function get_aid_donor_data(){
		global $code;
		$machinecode = str_replace(' ', '-', strtolower($code));
		$machinecode = str_replace(array(' ',',','.'), '', $machinecode);
		//echo '<h2>'.$machinecode.'</h2>';
		$str = file_get_contents(ATI_2024_WIDGET_PATH . '/src/data/results_2024.json');
		if($str){
			$json = json_decode($str, true);
			//echo '<pre>'.print_r($json,true).'</pre>';
			if(!empty($json[$machinecode])){
				$donorData = $json[$machinecode];
				$donorData['position'] = $donorData['rank'].'/'.count($json);
				return $donorData;
			}
		}
		return false;
	}

	function getColours(){
		$colours = array();
		$paletteFile = file_get_contents(ATI_2024_WIDGET_PATH . '/src/swatches/palette.js'); // imports palette json
		$paletteFile = strstr($paletteFile, '[');
		$paletteFile = str_replace(';','',$paletteFile);
		//$paletteFile = substr($paletteFile, stripos($paletteFile, '['), -1);
		//echo ('<pre>'.$paletteFile.'</pre>');
		if($paletteFile){
			$paletteJson = json_decode($paletteFile, true);
			$categories = [
				0 => "Very good",
				1 => "Good",
				2 => "Fair",
				3 => "Poor",
				4 => "Very poor"
			];
			foreach ($paletteJson as $k => $colourGroup){
				foreach ($colourGroup['entries'] as $i => $shade) {
					$colours[ $categories[ $k ] ][$i] = '#'.$shade['color']['hex'];
				}
			}
		}
		return $colours;
	}

	function atiTranslate($string, $lang='en') {
		global $translations; //caches array we include below
		//if ($lang === 'en') return $string;
		include_once ATI_2024_INCLUDES . '/translations.php'; // imports $translations

		$str = strtolower($string);

		if( !isset($translations[$lang][$str])){
			return $string;
		}

		return $translations[$lang][$str];

	}

	add_action( 'genesis_before_loop', 'ati_language_switcher', 11 );
	function ati_language_switcher(){
		global $prefix, $code, $lang;
		$prefix = 'ati_donor_meta_2024_';
		$code = get_post_meta( get_the_ID(), $prefix . 'code', true );
		$lang = get_post_meta( get_the_ID(), 'ati_page_2024_meta_language', true );

		/********/
		$second_loop = get_posts( array(
			'post_type' => 'donor_2024',
			'meta_key'   => $prefix . 'code',
			'meta_value' => $code,
		) );
		$output = '';
		if( ! empty( $second_loop ) && count($second_loop)>1 ){
			$output = '<div class="language-selector mb-3"><select class="ati-lang-options custom-select" onchange="if (this.value) window.location.href=this.value">';
			foreach ( $second_loop as $alts ){
				if(get_the_ID() === $alts->ID) {
					$active = ' selected';
					$language = $lang;
				}else{
					$active = '';
					$language = get_post_meta( $alts->ID, 'ati_page_2024_meta_language', true );
				}

				$output .= '<option class="' . $active . '" value="' .get_permalink($alts->ID).'"' . $active . '>'.atiTranslate('title',$language).'</option>';
			}
			$output .= '</select></div>';
		}
		echo $output;
		/********/
	}


	add_action('genesis_entry_content','graph_image', 5);
	function graph_image() {
		global $code, $lang;

		$donorData = get_aid_donor_data();
		$colours = getColours();

		if(!empty($donorData)){
			$donorColours = $colours[$donorData['performance_group']];
		}

		//$download_id = get_post_meta( get_the_ID(), 'ati_page_2024_meta_pdf_download_id_2024', true );

		echo '<div class="row donor-content"><div class="col-md-5 donor-graph">';
		echo '<div class="graph-wrapper position-sticky">';
		//echo do_shortcode( "[ati-graphs-2024 display=\"graph\" agency=\"{$code}\"]" );

		// need to try alternative graph drawing because React App not showing in PDF printing..
		$machinecode = str_replace(' ', '-', $code);
		$machinecode = str_replace(array(' ',',','.'), '', $machinecode);
		echo '<canvas id="donor-graphic" class="img-fluid" width="688" height="516" data-code="'.strtolower($machinecode).'" data-colours="'.$donorColours[2].','.$donorColours[0].'" data-path="'.plugins_url( 'widget/src/data/results_2024.json', dirname(__FILE__) ).'"></canvas>';

//		if(!empty($download_id)){
//			echo do_shortcode('[download id="'.$download_id.'" template="download-profile-'.$lang.'"]');
//		}


		echo '</div></div><div class="col-md-7 donor-information">';
		echo '<div class="donor-overview">';
		echo '<div class="donor-performance">';
		if ( ! empty( $donorData['score'] ) && !empty($donorColours) ) {
			echo '<div class="donor-score" style="background-color: ' . $donorColours[2] . ';color:#FFF;">'.atiTranslate('Score', $lang).': <span class="year-score">' . round( $donorData['score'], 1 ) . '</span></div>';
		}
		if ( ! empty( $donorData['position'] ) && !empty($donorColours) ) {
			echo '<div class="donor-position" style="background-color: ' . $donorColours[1] . ';color:' . $donorColours[4] . ';">'.atiTranslate('Position', $lang).': <span class="year-position">' . $donorData['position'] . '</span></div>';
		}
		if ( ! empty( $donorData['performance_group'] ) && !empty($donorColours) ) {
			//echo '<div class="performance-group" style="background-color: ' . $donorColours[0] . ';color:' . $donorColours[4] . ';">2024 <span class="year-category" style="color:' . $donorColours[2] . ';">' . atiTranslate($donorData['performance_group'],$lang) . '</span></div>';
			echo '<div class="performance-group" style="background-color: ' . $donorColours[0] . ';color:' . $donorColours[4] . ';">2024 <span class="year-category" style="color:#FFFFFF;">' . atiTranslate($donorData['performance_group'],$lang) . '</span></div>';
		}
		echo '</div>';

		echo '<h2>'.atiTranslate('Overview',$lang).'</h2>';
	}

	add_action('genesis_entry_content', 'ati_donor_content');
	function ati_donor_content(){

		global $prefix, $lang;


		$footnote = get_post_meta( get_the_ID(), $prefix . 'footnote', true );
		// $analysis = get_post_meta( get_the_ID(), $prefix . 'analysis', true );
		$recommendations = get_post_meta( get_the_ID(), $prefix . 'recommendations', true );

		echo '</div><!-- /.donor-overview -->';
		echo '<div class="donor-panels">';
		$donorData = get_aid_donor_data();

		$colours = getColours();

		//echo '<pre>'.print_r($colours,true).'</pre>';

		if($donorData) {
			echo '<div class="donor-result donor-panel">';

			if ( ! empty( $donorData['history'] ) ) {
				//echo '<pre>'.print_r($donorData['history'],true).'</pre>';
				echo '<div class="performance-history">';
				foreach ( $donorData['history'] as $value ) {
					$perf_group = ucfirst(strtolower($value['performance_group'])); // bad data in..
					echo '<div class="performance-year performance-year-' . $value['year'] . '" style="background-color: ' . $colours[ $perf_group ][0] . ';color: ' . $colours[ $perf_group ][4] . '">' . $value['year'] . ' <span class="year-category" style="color: ' . $colours[ $perf_group ][2] . '">' . atiTranslate($perf_group,$lang) . '</span></div>';
				}
				echo '</div>';
			}
			echo '</div>';
		}
		echo '<div class="donor-study row">';
		if($donorData){
			if(!empty($donorData['components'])){
				echo '<div class="donor-components donor-panel col-sm-3">';
				foreach ($donorData['components'] as $title => $component) {
					$idHTML = str_replace(array(' ','/','(',')'), '-', strtolower($title));
					$idString = str_replace(array(' ','/','(',')'), '_', strtolower($title));
					$idString = $idString . '_2024';
					$title = ati_get_component_option( $idString, 'title_'.$lang, $title);

					echo '<div class="component-performance"><a href="#'.$idHTML.'" data-toggle="tab" class="tab-toggler"><span class="label">'.$title.'</span> <span class="score">'.round($component['weighted_score'],1).' / '.$component['out_of'].'</span></a></div>';
				}
				echo '</div>';
			}
		}

		echo '<div class="donor-conclusion col-sm-9">';

//		if($analysis !== ''){
//			echo '<div class="donor-analysis donor-panel">';
//			echo '<h2>'.atiTranslate('Analysis',$lang).'</h2>';
//			echo wpautop($analysis);
//			echo '</div>';
//		}

		if($recommendations !== ''){
			echo '<div class="donor-recommendations donor-panel">';
			echo '<h2>'.atiTranslate('Recommendations',$lang).'</h2>';
			echo wpautop($recommendations);
			echo '</div>';
		}
		echo '</div></div>';
		if(!empty($footnote)){
			echo '<div class="small footnote">'.wpautop($footnote).'</div>';
		}

		echo '</div></div></div><!-- /.donor-content -->';


		//echo '<pre>' . print_r($donorData, true) . '</pre>';

	}



	add_action('genesis_entry_content','deep_dive', 20);
	function deep_dive(){
		include_once ATI_2024_INCLUDES . '/components-and-indicators.php'; // imports variable $components_and_indicators
		global $lang;
		$tabs = '';
		$panels = '';
		$popups = '';

		$donorData = get_aid_donor_data();
		$colours = getColours();
		$donorColours = $colours[$donorData['performance_group']];

		foreach ( $components_and_indicators  as $key => $component ) {
			// echo $key . ': <pre>' . print_r($component,true) . '</pre>';

			$idHTML = str_replace(array(' ','/','(',')'), '-', strtolower($component['title']));
			$idString = str_replace(array(' ','/','(',')'), '_', strtolower($component['title']));
			$idString = $idString . '_2024';


//			if($lang !== 'en'){
//				// english titles can be customised in plugin options editor
//				$title = atiTranslate($component['title'], $lang);
//			}else{
				$title = ati_get_component_option( $idString, 'title_'.$lang, $component['title']);
//			}
			$description = ati_get_component_option( $idString, 'description_'.$lang);


			$componentData = false;
			if(!empty($donorData['components'][$component['title']])){
				$componentData = $donorData['components'][$component['title']];
			}

			//echo  $idString;
			$active = '';
			$show = '';
			$selected = 'false';
			if($key == 0) {
				$active = ' active';
				$selected = 'true';
				$show = ' show';
			}
			$score = '';
			if(!empty($componentData)){
				// echo '<pre>' . print_r($componentData, true) . '</pre>';
				$score = '<div class="score">'.atiTranslate('Score', $lang).': '.round($componentData['weighted_score'],1).' <span class="lighter">/ '.$componentData['out_of'].'</span></div>';
			}


			//echo $idString . ': ' . $title .'<br>' . $description .'<br>';
			$tabs .= '<a class="nav-item nav-link'. $active .'" id="'.$idHTML.'-tab" data-toggle="tab" href="#'.$idHTML.'" role="tab" aria-controls="'.$idHTML.'" aria-selected="'.$selected.'">'.$title.'</a>';

			$panel = '<div class="component-info col-md-6">
						<h3>'.$title.'</h3>'.$score.'
						<div class="label">'.atiTranslate('About component', $lang).'</div>'.wpautop($description).'
					  </div>';


			$modals = [];
			$indicators = [];
			//echo '<pre>' . print_r($componentData['indicators'], true) . '</pre>';
			foreach ( $component['indicators']  as $row => $indicator ) {
//				$idString = str_replace(array(' ','/','(',')'), '_', strtolower($component['title']));
				//echo  $idString;
				$inString = str_replace(' ', '_', strtolower($indicator)).'_2024';
				$inData = false;
				if(!empty($componentData['indicators'][$indicator])){
					$inData = $componentData['indicators'][$indicator];
					// echo $indicator . ': <pre>' . print_r($inData, true) . '</pre>';
					// $score = '<div class="score">Score: '.round($componentData['weighted_score'],1).'/'.$componentData['out_of'].'</div>';
				}

				//echo  $inString.'<br>';
				$inTitle = ati_get_component_option( $idString, $inString.'_title_'.$lang, $indicator);
				$inDefinition = ati_get_component_option( $idString, $inString.'_description_'.$lang);


				$indicators[$row] = '<div class="indicator-score">';
				$indicators[$row] .= '<div class="top-group">';
				$indicators[$row] .= '<h4>'.$inTitle.'</h4>';

				if($inData){
					$indicators[$row] .= '<span class="weighted-score">'.atiTranslate('Score', $lang).': '.round($inData['score']*$inData['weight'], 2).'</span>';
				}

				$inID = str_replace(array('/','(',')'), '', $inString);

				if(!empty($inDefinition)) {
					$indicators[ $row ] .= '<button type="button" class="badge badge-pill badge-secondary modal-definition" data-toggle="modal" data-target="#' . $inID . '-modal">?</button>';
					//$indicators[$row] .= '<a tabindex="0" class="badge badge-pill badge-secondary popover-definition" role="button" data-toggle="popover" data-trigger="focus" title="'.$inTitle.' definition" data-content="'.$inDefinition.'">?</a>';
					$modals[$row] = '<div class="modal fade" id="'.$inID.'-modal" tabindex="-1" role="dialog" aria-labelledby="'.$inID.'-title" aria-hidden="true">
									  <div class="modal-dialog modal-dialog-centered" role="document">
									    <div class="modal-content">
									      <div class="modal-header">
									        <h5 class="modal-title" id="'.$inID.'-title">'.$inTitle.' '.__('definition','aid-transparency-index-2024').'</h5>
									        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
									          <span aria-hidden="true">&times;</span>
									        </button>
									      </div>
									      <div class="modal-body">'.wpautop($inDefinition).'</div>
									    </div>
									  </div>
									</div>';
				}

				// output indicator rows here

				$indicators[$row] .= '</div><!-- / .top-group -->';
				if($inData) {
					if(is_array($inData['status'])){ // =='Project procurement'
						foreach ($inData['status'] as $k => $s){
							$status = '';
							$format = '';
							if($k == 0){
								$publication_status = 'Tenders publication status';
							}else{
								$publication_status = 'Contracts publication status';
							}
							if(!empty($inData['status'][$k])){
								$status = '<div class="status">'.$publication_status  .": <span>" .$inData['status'][$k] . "</span></div>";
							}
							if(!empty($inData['format'][$k]) && !empty($inData['sources'])) {
								$sources = '';
								foreach ( $inData['sources'][ $k ] as $num => $source ) {
									$sources .= '<span><a target="_blank" href="' . $source . '"> [' . ( $num + 1 ) . ']</a></span>';
								}
								$format = "Format: <span>" . $inData['format'][ $k ] . "</span>" . $sources;
							}
							$indicators[$row] .= sprintf('<div class="indicator-row">%s<div class="format">%s</div></div>', $status, $format);
						}
					}else{
						$status = '';
						$format = '';
						$publication_status = atiTranslate('Publication status',$lang);
						if(!empty($inData['status'])) {
							$status = '<div class="status">'.$publication_status . ": <span>" . $inData['status'] . "</span></div>";
						}
						if(!empty($inData['format']) && !empty($inData['sources'])) {
							$sources = '';
							foreach ( $inData['sources'] as $num => $source ) {
								$sources .= '<span><a target="_blank" href="' . $source . '"> [' . ( $num + 1 ) . ']</a></span>';
							}
							$format = atiTranslate('Format', $lang) . ": <span>" . $inData['format'] . "</span>" . $sources;
						}
						$indicators[$row] .= sprintf('<div class="indicator-row">%s<div class="format">%s</div></div>', $status, $format);
					}
				}


				if(isset($inData['score'])) {
					$indicators[ $row ] .= '<div class="indicator-bar"><div class="bar-num" style="background-color: '.$donorColours[2].';width:' . $inData['score'] . '%;" title="' . $inData['score'] . '%"></div></div>';
				}
				$indicators[$row] .= '</div><!-- / .indicator-score -->';
			}

			$scores = '<div class="indicator-scores col-md-6">'.implode('', $indicators).'</div>';

			$panels .= '<div class="tab-pane '. $show . $active .' d-block d-sm-none" id="'.$idHTML.'" role="tabpanel" aria-labelledby="'.$idHTML.'-tab"><div class="component-scores row">'. $panel . $scores . '</div></div>';
			$popups .= implode('', $modals);
		}


		echo '<div class="alignfull" id="deep-dive"><div class="deep-dive wrap">
				<h2>'.__('Deep Dive','aid-transparency-index-2024').'</h2>
				<nav class="d-none d-sm-block">
				  <div class="nav nav-tabs" id="nav-tab" role="tablist">'.$tabs.'</div>
				</nav>
				<div class="tab-content" id="nav-tabContent">'.$panels.'</div>
			</div><!-- /.deep-dive --></div> '.$popups;

	}
	remove_action( 'genesis_entry_header', 'genesis_post_info', 12 );

	add_filter( 'genesis_markup_title-area_close', 'insert_html_after_title_area_markup', 10, 2 );
	/**
	 * Appends HTML to the closing markup for .title-area.
	 *
	 * @param string $close_html HTML tag being processed by the API.
	 * @param array  $args       Array with markup arguments.
	 *
	 * @return string
	 */
	function insert_html_after_title_area_markup( $close_html, $args ) {
		if ( $close_html ) {
			$close_html = $close_html . '<h2 class="pdf-print-only">'.__('Aid Transparency Index 2024' , 'aid-transparency-index-2024') . '</h2>';
		}
		return $close_html;
	}


	genesis();