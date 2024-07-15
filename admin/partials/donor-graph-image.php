<?php
	if(!empty($_GET['code'])){
		//write_log('code raw: '.$_GET['code']);
		$code = filter_var ( trim($_GET['code']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$machinecode = str_replace(' ', '-', strtolower($code));
		$machinecode = str_replace(array(' ',',','.'), '', $machinecode);
		//write_log('code filtered: '.$code);

		if(!empty($code)) {

			$donorData = array();
			$str = file_get_contents('../../widget/src/data/results_2024.json');
			if($str){
				$json = json_decode($str, true);
				if(!empty($json[$machinecode])){
					$donorData = $json[$machinecode];
					$donorData['position'] = $donorData['rank_combined'].'/'.count($json);
				}
			}
			if(!empty($donorData)){

				// load wordpress functions and tidy WP output
				if(file_exists( rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp-load.php' )) {
					include_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp-load.php';
				}
				else if(file_exists( rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp/wp-load.php' )){
					include_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp/wp-load.php';
				}
				remove_action('wp_footer', 'EUCLC_cookieMessage');
				remove_action('wp_footer', 'SCCM_cookieMessage');
				function tasty_remove_scripts_styles() {
					// remove all loaded Scripts and styles
					global $wp_scripts;
					foreach( $wp_scripts->queue as $script ) :
						wp_dequeue_script($wp_scripts->registered[$script]->handle);
					endforeach;

					global $wp_styles;
					foreach( $wp_styles->queue as $style ) :
						wp_dequeue_style($wp_styles->registered[$style]->handle);
					endforeach;

					wp_enqueue_script( 'aid-transparency-index-2024', plugin_dir_url( dirname(__DIR__) ) . 'public/dist/aid-transparency-index-public.min.js', array(
						'jquery'
					), filemtime( plugin_dir_path( dirname(__DIR__) ) . 'public/dist/aid-transparency-index-public.js' ), true );

				}
				add_action( 'wp_enqueue_scripts', 'tasty_remove_scripts_styles', 100 );

				$colours = array();
				$paletteFile = file_get_contents('../../widget/src/swatches/palette.js'); // imports palette json
				$paletteFile = strstr($paletteFile, '[');
				$paletteFile = str_replace(';','',$paletteFile);
				if($paletteFile){
					$paletteJson = json_decode($paletteFile, true);
					//write_log($paletteJson);
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
				$donorColours = $colours[ucfirst(strtolower($donorData['performance_group']))];
				$graph = '';
		
				if(!empty($donorData)){

					// first we’ll check for historic data
					if(!empty($donorData['history']) && is_array($donorData['history'])){
						$performance = [];
						$include_footnote = false;
						foreach ($donorData['history'] as $record) {
							if($record['score'] !== null && $record['score'] !== ''){
								$year = $record['year'];
								// Round the score to 1 decimal places
								$score = round($record['score'], 1);
								$performance_group = ucfirst(strtolower($record['performance_group']));
								$performance[$year] = [$score, $colours[$performance_group][0]];
								
								if($year < 2017){
									$include_footnote = true;
								}
							}
						}
						$perf_group = ucfirst(strtolower($donorData['performance_group']));
						$performance[2024] = [ $donorData['score_rounded'], $colours[$perf_group][0] ];
						// Sort the array by keys (years) in ascending order
						ksort($performance);
					}

					$machinecode = str_replace(' ', '-', $code);
					$machinecode = str_replace(array(' ',',','.'), '', $machinecode);
					if(!empty($performance) && count($performance) > 1){
						// Convert the PHP array to JSON
						$performanceJson = json_encode($performance);
						if($include_footnote){
						$footnote = '<small>'.__('The methodology for the Aid Transparency Index continues to evolve. Changes to the methodology made after 2016 means that results are not directly comparable before this time.','aid-transparency-index-2024').'</small>';
						}else{
							$footnote = '';
						}
						// Escape the JSON for HTML attribute use
						$escapedPerformanceJson = htmlspecialchars($performanceJson, ENT_QUOTES, 'UTF-8');
						$graph = '<figure class="historic-data"><canvas id="historic-performance-graphic" class="img-fluid" width="688" height="516" data-code="'.strtolower($machinecode).'" data-name="'.$donorData['display_name'].'" data-performance="'.$escapedPerformanceJson.'"></canvas><figcaption>'.$donorData['display_name'].' – '.__('Historical performance','aid-transparency-index-2024').'</figcaption>'.$footnote.'</figure>';
					}else{
						$graph = '<canvas id="donor-graphic" class="img-fluid" width="688" height="516" data-code="'.strtolower($machinecode).'" data-colours="'.$donorColours[2].','.$donorColours[0].'" data-path="'.plugins_url( 'widget/src/data/results_2024.json', dirname(__FILE__) ).'"></canvas>';
					}

				}
				//write_log($donorColours);
				do_action( 'wp_head' );
				//write_log(plugins_url( 'widget/src/data/results_2024.json', dirname(__DIR__)  ));
				echo $graph;
				do_action( 'wp_footer' );
			}else{
				http_response_code(404);
			}

		}else{
			http_response_code(404);
		}


	}else{
		http_response_code(404);
	}
